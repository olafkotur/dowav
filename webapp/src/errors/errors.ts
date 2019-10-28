import { ErrorMessages } from '../types';

export const fetchErrorMessages: ErrorMessages = {
    timeout: {
        title: 'Error',
        message:
            'Looks like the server is taking to long to respond, please try again in sometime.',
        actions: ['refetch']
    }
};
