// import React from 'react';
// import useFetch from './useFetch';
// import 'whatwg-fetch';
// import { renderHook, act } from '@testing-library/react-hooks';

// describe('useFetch Hook', () => {
//     it('Should have ititial value', () => {
//         const {
//             result: { current }
//         } = renderHook(() =>
//             useFetch({
//                 useCache: false,
//                 query: {
//                     endpoint: `/api/historic/temperature}`,
//                     params: {
//                         zone: 1,
//                         from: 1,
//                         to: Math.floor(Date.now() / 1000)
//                     }
//                 },
//                 refetch: 0
//             })
//         );
//         expect(current.loading).toEqual(true);
//         expect(current.data).toEqual(null);
//         expect(current.error).toEqual(null);
//     });
//     it('Should return data when fetch is successfull', async () => {
//         const mockSuccessResponse = { success: true };
//         const mockJsonPromise = Promise.resolve(mockSuccessResponse); // 2
//         const mockFetchPromise = Promise.resolve({
//             json: () => mockJsonPromise
//         });
//         jest.spyOn(global, 'fetch').mockImplementation((api: string) => {
//             console.log(api);
//             mockFetchPromise;
//         });

//         const {
//             result: { current },
//             waitForNextUpdate
//         } = renderHook(() =>
//             useFetch({
//                 useCache: false,
//                 query: {
//                     endpoint: `/api`,
//                     params: {
//                         zone: 1,
//                         from: 1,
//                         to: Math.floor(Date.now() / 1000)
//                     }
//                 },
//                 refetch: 0
//             })
//         );
//         await waitForNextUpdate();
//         console.log(current);

//     });
// });
