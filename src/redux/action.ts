export const amoutChange = (newAmount: string, typeOfAmt: string) => {
    return {
        type: 'UPDATE_STRING',
        payload: { newAmount, typeOfAmt },
    };
};
