// import React from 'react';

import { useState } from 'react';
import database from '../firebase';
import { ref, set } from 'firebase/database';
import { amoutChange } from '../redux/action';
import { useDispatch } from 'react-redux';
import History from './History';

function Update() {
    const dispatch = useDispatch();
    const [addEntry, setAddEntry] = useState(false);
    const [viewHistory, setViewHistory] = useState(false);
    const [editNet, setEditNet] = useState(false);
    const [title, setTitle] = useState('');
    const [net, setNet] = useState('');
    const [amount, setAmount] = useState('');
    const [inOut, setInOut] = useState('out');

    const today = new Date();
    const dateString = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(
        today.getDate()
    ).padStart(2, '0')}`;

    const [date, setDate] = useState(dateString);

    function getYear(date: string) {
        return new Date(date).getFullYear();
    }

    function getMonth(date: string) {
        return new Date(date).getMonth() + 1;
    }

    function getDay(date: string) {
        return new Date(date).getDate();
    }

    function getCurrentTimeInMilliseconds() {
        return new Date().getTime();
    }

    function updateNet() {
        if (net === '') {
            alert('Please fill all the fields');
            return;
        } else {
            set(ref(database, `user/store/networth`), net).catch((error) => alert('Error: ' + error.message));
            setNet('');
            setEditNet(false);
        }
    }

    function addChanges() {
        if (title === '' || amount === '') {
            alert('Please fill all the fields');
            return;
        } else {
            console.log(title, amount, date, inOut);
            set(
                ref(
                    database,
                    `user/store/transactions/${getYear(date)}/${getMonth(date)}/${getDay(
                        date
                    )}/${getCurrentTimeInMilliseconds()}`
                ),
                {
                    Title: title,
                    Amount: amount,
                    Type: inOut,
                }
            ).catch((error) => alert('Error: ' + error.message));

            dispatch(amoutChange(amount, inOut));

            setTitle('');
            setAmount('');
            setInOut('out');
            setDate(dateString);
            setAddEntry(false);
        }
    }

    return (
        <div>
            <button className="bg-black-500 text-white p-2 rounded-md m-2" onClick={() => setAddEntry(!addEntry)}>
                {addEntry ? 'Collapse ⬆' : 'New Entry'}
            </button>
            <button className="bg-black-500 text-white p-2 rounded-md m-2" onClick={() => setEditNet(!editNet)}>
                {editNet ? 'Collapse ⬆' : 'Edit Net Worth'}
            </button>
            <button
                className="bg-black-500 text-white p-2 rounded-md m-2"
                onClick={() => {
                    setViewHistory(!viewHistory);
                }}
            >
                {viewHistory ? 'Hide Search' : 'View Search'}
            </button>

            {addEntry && (
                <div className="border rounded-lg border-black m-2">
                    <input
                        type="text"
                        placeholder="Title"
                        name="title"
                        className="p-2 rounded-md m-2"
                        onChange={(e) => setTitle(e.target.value)}
                    />
                    <input
                        type="number"
                        placeholder="Amount"
                        name="amount"
                        className="p-2 rounded-md m-2"
                        onChange={(e) => setAmount(e.target.value)}
                    />
                    <div>
                        <select
                            className="bg-black-500 text-white p-2 rounded-md"
                            value={inOut}
                            onChange={(e) => setInOut(e.target.value)}
                        >
                            <option value="out">Debit</option>
                            <option value="in">Credit</option>
                            <option value="mid">Invest</option>
                        </select>
                        <input
                            type="date"
                            name="date"
                            className="p-2 rounded-md border-black border"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                        />
                    </div>
                    <div>
                        <button className="bg-black-500 text-white p-2 rounded-md m-2" onClick={() => addChanges()}>
                            Upload
                        </button>
                    </div>
                </div>
            )}
            {editNet && (
                <div className="border rounded-lg border-black m-2">
                    <input
                        type="text"
                        placeholder="Net Worth"
                        name="netWorth"
                        className="p-2 rounded-md m-2"
                        onChange={(e) => setNet(e.target.value)}
                    />
                    <div>
                        <button className="bg-black-500 text-white p-2 rounded-md m-2" onClick={() => updateNet()}>
                            Update
                        </button>
                    </div>
                </div>
            )}
            <div>
                <History activate={viewHistory} />
            </div>
        </div>
    );
}

export default Update;
