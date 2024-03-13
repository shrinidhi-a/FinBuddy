import { onValue, ref, remove } from 'firebase/database';
import { useEffect, useState } from 'react';
import database from '../firebase';
import numberToRupees from '../reusables/numberToRupees';
import { useDispatch } from 'react-redux';
import { amoutChange } from '../redux/action';

interface HistoryTableProps {
    date: string;
    showMinorTable: boolean;
}

function HistoryTable(props: HistoryTableProps) {
    const [transactions, setTransactions] = useState([] as any[]);
    const [totalIn, setTotalIn] = useState(0);
    const [totalOut, setTotalOut] = useState(0);
    const [totalMid, setTotalMid] = useState(0);
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [selectedTransaction, setSelectedTransaction] = useState({} as any);

    const dispatch = useDispatch();

    function openModal(transaction: any) {
        setSelectedTransaction(transaction);
        setModalIsOpen(true);
    }

    function closeModal() {
        setModalIsOpen(false);
    }

    function confirmDelete() {
        if (selectedTransaction !== null && selectedTransaction !== undefined) deleteDBEntry(selectedTransaction);
        closeModal();
    }

    function getYear(date: string) {
        return new Date(date).getFullYear();
    }

    function getMonth(date: string) {
        return new Date(date).getMonth() + 1;
    }

    function convertDayIntoDateString(day: number) {
        const date = new Date();
        date.setDate(day);
        return `${String(date.getDate()).padStart(2, '0')}/${String(date.getMonth() + 1).padStart(
            2,
            '0'
        )}/${date.getFullYear()}`;
    }

    function getColor(type: string) {
        if (type === 'in') {
            return 'text-green-500';
        } else if (type === 'out') {
            return 'text-red-500';
        } else {
            return 'text-yellow-500';
        }
    }

    function deleteDBEntry(transaction: any) {
        const transactionsRef = ref(
            database,
            `user/store/transactions/${getYear(props.date)}/${getMonth(props.date)}/${transaction.date}/${
                transaction.milliSeconds
            }`
        );

        remove(transactionsRef)
            .then(() => {
                if (transaction.type === 'in') dispatch(amoutChange(transaction.amount, 'removed_in'));
                else if (transaction.type === 'out') dispatch(amoutChange(transaction.amount, 'removed_out'));
            })
            .catch((error) => {
                alert('Remove failed: ' + error.message);
            });
    }

    useEffect(() => {
        const fetchTransactions = async () => {
            const transactionsRef = ref(
                database,
                `user/store/transactions/${getYear(props.date)}/${getMonth(props.date)}`
            );

            onValue(transactionsRef, (snapshot) => {
                const transactionsData = snapshot.val();
                let transactionsList = [];
                let totalIn = 0;
                let totalOut = 0;
                let totalMid = 0;

                for (const day in transactionsData) {
                    const transactionInDay = transactionsData[day];
                    for (const transaction in transactionInDay) {
                        if (transactionInDay[transaction].Type === 'in') {
                            totalIn += Number(transactionInDay[transaction].Amount);
                        } else if (transactionInDay[transaction].Type === 'out') {
                            totalOut += Number(transactionInDay[transaction].Amount);
                        } else if (transactionInDay[transaction].Type === 'mid') {
                            totalMid += Number(transactionInDay[transaction].Amount);
                        }

                        transactionsList.push({
                            date: day,
                            type: transactionInDay[transaction].Type,
                            title: transactionInDay[transaction].Title,
                            amount: transactionInDay[transaction].Amount,
                            milliSeconds: transaction,
                        });
                    }
                }

                // console.log(transactionsList);
                setTotalIn(totalIn);
                setTotalOut(totalOut);
                setTotalMid(totalMid);
                setTransactions(transactionsList);
            });
        };

        fetchTransactions();
    }, [props.date]);

    return (
        <>
            {props.showMinorTable && (
                <table className="w-full border-collapse">
                    <thead>
                        <tr className="bg-black">
                            <th className="border border-black p-2">Monthly In</th>
                            <th className="border border-black p-2">Monthly Out</th>
                            <th className="border border-black p-2">Investment</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr className="border-b border-gray-300">
                            <td className={`border border-black p-2 text-red-500`}>
                                {numberToRupees(Number(totalIn))}
                            </td>
                            <td className={`border border-black p-2 text-green-500`}>
                                {numberToRupees(Number(totalOut))}
                            </td>
                            <td className={`border border-black p-2 text-yellow-500`}>
                                {numberToRupees(Number(totalMid))}
                            </td>
                        </tr>
                    </tbody>
                </table>
            )}
            <table className="w-full border-collapse">
                <thead>
                    <tr className="bg-black">
                        <th className="border border-black p-2">Date</th>
                        <th className="border border-black p-2">Title</th>
                        <th className="border border-black p-2">Amount</th>
                        <th className="border border-black p-2">Action</th>
                    </tr>
                </thead>
                <tbody>
                    {transactions.map((transaction, index) => (
                        <tr key={index} className="border-b border-gray-300">
                            <td className={`border border-black p-2 ${getColor(transaction.type)}`}>
                                {convertDayIntoDateString(transaction.date)}
                            </td>
                            <td className={`border border-black p-2 ${getColor(transaction.type)}`}>
                                {transaction.title}
                            </td>
                            <td className={`border border-black p-2 ${getColor(transaction.type)}`}>
                                {numberToRupees(Number(transaction.amount))}
                            </td>
                            <td className="border border-black">
                                <button
                                    className="bg-black-500 text-white p-2 rounded-md m-2"
                                    onClick={() => {
                                        openModal(transaction);
                                    }}
                                >
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            {modalIsOpen && (
                <div className="fixed z-10 inset-0 overflow-y-auto">
                    <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                        <div className="inline-block align-bottom bg-black rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                            <div className="bg-black px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                                <h2>Are you sure you want to delete this Entry?</h2>
                            </div>
                            <div className="bg-black px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                                <button
                                    onClick={confirmDelete}
                                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-customGray text-base font-medium text-white hover:bg-customGray focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-customGray sm:ml-3 sm:w-auto sm:text-sm"
                                >
                                    Yes
                                </button>
                                <button
                                    onClick={closeModal}
                                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-customGray sm:mt-0 sm:w-auto sm:text-sm"
                                >
                                    No
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export default HistoryTable;
