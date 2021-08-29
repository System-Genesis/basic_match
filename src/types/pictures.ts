export type PNCYPicture = {
    personalNumber: string;
    path: string;
    format: string;
    takenAt: string;
    updatedAt: string;
};

export type picture = {
    profile: {
        url: string;
        meta: {
            format: string;
            takenAt: string;
            updatedAt: string;
        };
    };
};
