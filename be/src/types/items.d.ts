type ItemWithContent = {
    path: string;
    type: 'RAW_FILE' | 'DIRECTORY';
    createdAt: Date;
    Content: {
        data: string;
    }[];
};

type SimpleItem = {
    path: string;
    type: 'RAW_FILE' | 'DIRECTORY';
};
