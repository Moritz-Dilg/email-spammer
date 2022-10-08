export type transportConfigType = {
    host: string;
    port: number;
    user: string;
    pass: string;
};

export type messageType = {
    count: number;
    from: string;
    to: string;
    subject: string;
    text: string;
    html: string;
};