export class HttpError extends Error {
    status: number;
    
    constructor(message: string, status: number) {
        super(message);
        this.status = status;
    }
}

export const handleError = (err: any, res: any) => {
    const { status = 500, message } = err;
    res.status(status).json({
        status,
        message
    });
}; 