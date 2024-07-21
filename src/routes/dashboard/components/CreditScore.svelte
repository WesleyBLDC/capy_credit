<!--
@component

The `CreditScore` component displays the user's credit score based on the count of transactions.
-->

<script>
    import { page } from '$app/stores'

    function calculateCreditScore(data) {
        let score = 400 // Base score

        // Find USDC balance
        const usdcBalance = data.balances.find(
            (balance) => balance.asset_code === 'USDC' && balance.asset_type === 'credit_alphanum4'
        )

        // Currency Balance (only check USDC)
        if (usdcBalance) {
            const balanceAmount = parseFloat(usdcBalance.balance)
            if (balanceAmount > 80) {
                score += 100
            } else if (balanceAmount > 20) {
                score += 50
            } else if (balanceAmount > 10) {
                score += 25
            }
        }

        // Filter USDC payments
        const usdcPayments = data.payments.filter(
            (payment) => payment.asset_code === 'USDC' && payment.asset_type === 'credit_alphanum4'
        )
        const numTransfers = usdcPayments.length

        // Number of Transfers
        if (numTransfers > 15) {
            score += 100
        } else if (numTransfers > 10) {
            score += 50
        } else if (numTransfers > 5) {
            score += 25
        }

        // Amount of Transfers
        const totalTransferAmount = usdcPayments.reduce(
            (sum, payment) => sum + parseFloat(payment.amount),
            0
        )
        if (totalTransferAmount > 100) {
            score += 100
        } else if (totalTransferAmount > 50) {
            score += 50
        } else if (totalTransferAmount > 10) {
            score += 25
        }

        // Additional Logic: Account Age based on the earliest payment transfer date
        const earliestPayment = data.payments.reduce((earliest, payment) => {
            const paymentDate = new Date(payment.created_at)
            return paymentDate < earliest ? paymentDate : earliest
        }, new Date())

        const accountAgeInDays = (new Date() - earliestPayment) / (1000 * 60 * 60 * 24)
        if (accountAgeInDays > 2 * 365) {
            score += 50
        } else if (accountAgeInDays > 1 * 365) {
            score += 25
        }

        // Ensure score is within range 300 to 850
        return Math.min(Math.max(score, 300), 850)
    }

    // Calculate the credit score based on the number of transactions
    $: creditScore = calculateCreditScore($page.data)
    // $: creditScore = $page.data.payments ? $page.data.payments.length : 0
</script>

<h3>Credit Score</h3>
<div class="stats stats-vertical w-full bg-primary text-primary-content shadow lg:stats-horizontal">
    <div class="stat">
        <div class="stat-title">Credit Score</div>
        <div class="stat-value">{creditScore}</div>
    </div>
</div>
