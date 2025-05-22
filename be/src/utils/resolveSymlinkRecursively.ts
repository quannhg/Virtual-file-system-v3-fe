import { logger } from "@configs";
import { FileType } from "@prisma/client";
import { prisma } from "@repositories";

const resolveSymlinkRecursively = async (path: string): Promise<string> => {
    let currentPath = path;
    const visitedPaths = new Set<string>();
    
    while (true) {
      // Prevent infinite loops from symlink cycles
      if (visitedPaths.has(currentPath)) {
        logger.warn(`Symlink cycle detected at path: ${currentPath}`);
        return currentPath;
      }
      visitedPaths.add(currentPath);
      
      const file = await prisma.file.findUnique({
        where: { path: currentPath }
      });
      
      // If file doesn't exist or is not a symlink, return current path
      if (!file || file.type !== FileType.SYMLINK || !file.targetPath) {
        return currentPath;
      }
      
      // Move to target path and continue resolving
      currentPath = file.targetPath;
    }
  };