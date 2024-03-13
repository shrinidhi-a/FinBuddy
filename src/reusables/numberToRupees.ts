export default function numberToRupees(amount: number) {
    return amount.toLocaleString('en-IN', {
        style: 'currency',
        currency: 'INR',
    });
}
