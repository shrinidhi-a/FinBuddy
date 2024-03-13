import { useEffect, useState } from 'react';
import { HmacSHA256 } from 'crypto-js';
import { onValue, ref } from 'firebase/database';
import database from '../firebase';
import { NetView } from './NetView';
import Spacer from './Spacer';
import { MonthlyInOut } from './MonthInOut';
import Update from './Update';
import { Investments } from './Investments';

function Validator() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [entered, setEntered] = useState(false);
    const [currectEmail, setCurrectEmail] = useState(false);
    const [currectPassword, setCurrectPassword] = useState(false);

    const key = import.meta.env.VITE_APP_CRYPTO_SECRET;

    function validate(email: string, password: string) {
        if (email === '' || password === '') {
            alert('Please enter email and password');
        } else {
            const hashedPassword = HmacSHA256(password, key).toString();

            const userEmail = ref(database, 'user/email');
            const userPassword = ref(database, 'user/password');

            onValue(userEmail, (snapshot) => {
                const data = snapshot.val();
                if (data === email) {
                    setCurrectEmail(true);
                } else {
                    alert('Email is incorrect');
                }
            });

            onValue(userPassword, (snapshot) => {
                const data = snapshot.val();
                if (data === hashedPassword) {
                    setCurrectPassword(true);
                } else {
                    alert('Password is incorrect');
                }
            });
        }
    }

    useEffect(() => {
        if (currectEmail && currectPassword) {
            setEntered(true);
        }
    }, [currectEmail, currectPassword]);

    return (
        <>
            {!entered && (
                <>
                    <h1 className="text-2xl font-bold text-center my-4">FinBuddy</h1>
                    <form>
                        <input
                            type="email"
                            placeholder="Enter your email"
                            className="m-2 p-2 rounded-md"
                            onChange={(e) => {
                                setEmail(e.target.value);
                            }}
                        />
                        <input
                            type="password"
                            placeholder="Enter your password"
                            className="m-2 p-2 rounded-md"
                            onChange={(e) => {
                                setPassword(e.target.value);
                            }}
                        />
                        <div>
                            <button
                                className="bg-black-500 text-white p-2 rounded-md m-2"
                                onClick={(e) => {
                                    e.preventDefault();
                                    validate(email, password);
                                }}
                            >
                                Submit
                            </button>
                        </div>
                    </form>
                </>
            )}
            {entered && (
                <>
                    <NetView />
                    <Spacer />
                    <MonthlyInOut />
                    <Spacer />
                    <Investments />
                    <Spacer />
                    <Update />
                </>
            )}
        </>
    );
}

export default Validator;
