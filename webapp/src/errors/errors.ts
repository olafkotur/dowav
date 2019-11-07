import { ErrorMessages } from '../types';

export const fetchErrorMessages: ErrorMessages = {
    timeout: {
        title: 'Error',
        message:
            'Looks like the server is taking to long to respond, please try again in sometime.',
        actions: ['refetch']
    },
    fetchFail: {
        title: 'Error',
        message: "We can't get data right now. Try a little bit later",
        actions: ['refetch']
    },
    noData: {
        title: 'No Data.',
        message: 'Seems like there is no data available at the moment.',
        actions: ['refetch']
    }
};
