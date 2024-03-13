import { onValue, ref } from 'firebase/database';
import database from '../firebase';
import numberToRupees from '../reusables/numberToRupees';
import { useEffect, useState } from 'react';

export const MonthlyInOut = () => {
    const [monthlyIn, setMonthlyIn] = useState(0);
    const [monthlyOut, setMonthlyOut] = useState(0);

    function getYear() {
        return new Date().getFullYear();
    }

    function getMonth() {
        return new Date().getMonth() + 1;
    }

    useEffect(() => {
        const fetchMonthlyInOut = async () => {
            const transactionsRef = ref(database, `user/store/transactions/${getYear()}/${getMonth()}`);

            onValue(transactionsRef, (snapshot) => {
                const transactions = snapshot.val();
                // console.log(transactions);
                let totalIn = 0;
                let totalOut = 0;

                for (const day in transactions) {
                    // console.log(transactions[day]);
                    const transactioninday = transactions[day];
                    for (const transaction in transactioninday) {
                        // console.log(transactioninday[transaction]);
                        if (transactioninday[transaction].Type === 'in') {
                            totalIn += Number(transactioninday[transaction].Amount);
                        } else if (transactioninday[transaction].Type === 'out') {
                            totalOut += Number(transactioninday[transaction].Amount);
                        }
                    }
                }
                // console.log(totalIn, totalOut);
                setMonthlyIn(totalIn);
                setMonthlyOut(totalOut);
            });
        };

        fetchMonthlyInOut();
    }, []);

    return (
        <div>
            <p className="text-2xl">Monthly In & Out</p>
            <p className="text-2xl text-green-500">{numberToRupees(Number(monthlyIn))}</p>
            <p className="text-2xl text-red-500">{numberToRupees(Number(monthlyOut))}</p>
        </div>
    );
};
