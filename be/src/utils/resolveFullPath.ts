import { FileType } from '@prisma/client';
import { prisma } from '@repositories';
import { logger } from '@configs';

/**
 * Resolves a path that might contain symlinks at any level to its real path
 * Example: 
 * - If /demo is a symlink to /example/path, then /demo/chat -> /example/path/chat
 * - If /folder/demo is a symlink to /example/path, then /folder/demo/chat -> /example/path/chat
 * 
 * @param path - The path that may contain symlinks anywhere in its parts
 * @returns The resolved real path
 */
export const resolveSymlinkPath = async (path: string): Promise<string> => {
  // Handle root path
  if (path === '/') return path;
  
  // Split path into segments
  const segments = path.split('/').filter(Boolean);
  let currentPath = '';
  let resultPath = '';
  
  // Process each segment one by one
  for (let i = 0; i < segments.length; i++) {
    // Build the current path up to this segment
    currentPath = currentPath ? `${currentPath}/${segments[i]}` : `/${segments[i]}`;
    
    // Check if this path exists in the database
    const file = await prisma.file.findUnique({
      where: { path: currentPath }
    });
    
    // If file doesn't exist, just append the segment to result
    if (!file) {
      resultPath = resultPath ? `${resultPath}/${segments[i]}` : `/${segments[i]}`;
      continue;
    }
    
    // If it's a symlink, replace current result path with target
    if (file.type === FileType.SYMLINK && file.targetPath) {
      resultPath = file.targetPath;
    } else {
      // Not a symlink, just append the segment to result
      resultPath = resultPath ? `${resultPath}/${segments[i]}` : `/${segments[i]}`;
    }
  }
  
  return resultPath;
};

/**
 * Resolves a path with symlinks at any position including middle of path
 * Example: If /folder/demo is a symlink to /example/path
 * then /folder/demo/chat will be resolved to /example/path/chat
 * 
 * @param path - The path that may contain symlinks anywhere
 * @returns The fully resolved path
 */
export const resolveFullPath = async (path: string): Promise<string> => {
  // Handle root path
  if (path === '/') return path;
  
  const segments = path.split('/').filter(Boolean);
  let currentPath = '';
  let resultPath = '/';
  
  for (let i = 0; i < segments.length; i++) {
    // Update current path with this segment
    currentPath = currentPath ? `${currentPath}/${segments[i]}` : `/${segments[i]}`;
    
    // Check if current path segment exists
    const file = await prisma.file.findUnique({
      where: { path: currentPath }
    });
    
    if (!file) {
      // If path doesn't exist yet, just add segment to result
      const segment = segments[i];
      resultPath = resultPath === '/' ? `/${segment}` : `${resultPath}/${segment}`;
    } else if (file.type === FileType.SYMLINK && file.targetPath) {
      // Found a symlink, replace result with target path
      resultPath = file.targetPath;
      
      // Now we need to handle remaining segments
      if (i < segments.length - 1) {
        const remainingPath = `${file.targetPath}/${segments.slice(i + 1).join('/')}`;
        // Recursively resolve the remaining path
        return resolveFullPath(remainingPath);
      }
    } else {
      // Regular file or directory, just update resultPath
      const segment = segments[i];
      resultPath = resultPath === '/' ? `/${segment}` : `${resultPath}/${segment}`;
    }
  }
  
  return resultPath;
};

/**
 * Resolves symlinks in a path with debug information
 * @param path - Path to resolve
 * @returns The resolved real path with detailed steps
 */
export const debugResolveSymlinkPath = async (path: string): Promise<{ 
  result: string, 
  steps: Array<{ segment: string, currentPath: string, isSymlink: boolean, targetPath?: string, resultPath: string }> 
}> => {
  if (path === '/') return { result: '/', steps: [] };
  
  const segments = path.split('/').filter(Boolean);
  let currentPath = '';
  let resultPath = '';
  const steps = [];
  
  for (let i = 0; i < segments.length; i++) {
    currentPath = currentPath ? `${currentPath}/${segments[i]}` : `/${segments[i]}`;
    
    const file = await prisma.file.findUnique({
      where: { path: currentPath }
    });
    
    const step: any = {
      segment: segments[i],
      currentPath,
      isSymlink: false,
      resultPath: ''
    };
    
    if (!file) {
      resultPath = resultPath ? `${resultPath}/${segments[i]}` : `/${segments[i]}`;
      step.resultPath = resultPath;
      steps.push(step);
      continue;
    }
    
    if (file.type === FileType.SYMLINK && file.targetPath) {
      step.isSymlink = true;
      step.targetPath = file.targetPath;
      resultPath = file.targetPath;
      
      // For debugging symlinks in middle of path
      if (i < segments.length - 1) {
        step.remainingSegments = segments.slice(i + 1);
      }
    } else {
      resultPath = resultPath ? `${resultPath}/${segments[i]}` : `/${segments[i]}`;
    }
    
    step.resultPath = resultPath;
    steps.push(step);
  }
  
  return { result: resultPath, steps };
};