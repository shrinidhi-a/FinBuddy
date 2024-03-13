import { useEffect, useState } from 'react';
import numberToRupees from '../reusables/numberToRupees';
import database from '../firebase';
import { onValue, ref } from 'firebase/database';

export const Investments = () => {
    const [investment, setInvestment] = useState(0);

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
                let totalMid = 0;

                for (const day in transactions) {
                    const transactioninday = transactions[day];
                    for (const transaction in transactioninday) {
                        if (transactioninday[transaction].Type === 'mid') {
                            totalMid += Number(transactioninday[transaction].Amount);
                        }
                    }
                }

                setInvestment(totalMid);
            });
        };

        fetchMonthlyInOut();
    }, []);
    return (
        <div>
            <p className="text-2xl">Monthly Investments</p>
            <p className="text-2xl text-yellow-500">{numberToRupees(Number(investment))}</p>
        </div>
    );
};
