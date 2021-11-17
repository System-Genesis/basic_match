export type logObject = {
    level: string;
    title: string;
    scope: string;
    system: string;
    service: string;
    message: string;
    extraFields?: any;
};

export type scopeOption = 'APP' | 'SYSTEM';

export type levelOptions = 'info' | 'warn' | 'error';
