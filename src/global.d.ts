


declare namespace Express {
    export interface Request {
  
    }

    export interface Response {
        sendSuccess: (data: any, message?: string) => void;
        sendError: (error: any, errorCode?: number) => void;
    }

}
