import React from 'react';
import { FetchError } from '../types';
import { IoIosRefresh } from 'react-icons/io';

const ErrorMessage: React.FC<{ error: FetchError; onRefetch: any }> = ({
    error,
    onRefetch
}) => {
    return (
        <div className="error-box">
            <h1>{error.title}</h1>
            <p>{error.message}</p>
            {error && error.actions!.includes('refetch') ? (
                <div>
                    <IoIosRefresh
                        size="40"
                        color="white"
                        className="refetch-icon"
                        onClick={onRefetch}
                    />
                </div>
            ) : null}
        </div>
    );
};

export default ErrorMessage;
