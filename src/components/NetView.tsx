import { useEffect, useState } from 'react';
import { ref, onValue, set } from 'firebase/database';
import database from '../firebase';
import numberToRupees from '../reusables/numberToRupees';
import { useDispatch, useSelector } from 'react-redux';
import { amoutChange } from '../redux/action';

export const NetView = () => {
    const [net, setNet] = useState(0);
    const dispatch = useDispatch();
    const currentString = useSelector((state) => state);

    function setNetInDB(value: number) {
        set(ref(database, `user/store/networth`), value).catch((error) => alert('Error: ' + error.message));
    }

    useEffect(() => {
        const current = currentString as any;
        const types = ['in', 'out', 'removed_in', 'removed_out'];

        if (types.includes(current.typeOfAmt)) {
            console.log(currentString);

            const adjustment = ['in', 'removed_out'].includes(current.typeOfAmt) ? 1 : -1;
            const amount = Number(net) + adjustment * Number(current.newAmount);

            setNet(amount);
            setNetInDB(amount);
        }
    }, [currentString]);

    useEffect(() => {
        const fetchNet = async () => {
            const starCountRef = ref(database, 'user/store/networth');
            onValue(starCountRef, (snapshot) => {
                const data = snapshot.val();
                setNet(data);
                dispatch(amoutChange(data, ''));
            });
        };

        fetchNet();
    }, []);

    return (
        <div>
            <p className="text-2xl">Net Worth</p>
            <p className="text-3xl text-green-500">{numberToRupees(Number(net))}</p>
        </div>
    );
};
