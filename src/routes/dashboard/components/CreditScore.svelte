<!--
@component

The `CreditScore` component displays the user's credit score based on the count of transactions.
-->

<script>
    import { page } from '$app/stores'

    function calculateCreditScore(data) {
        let score = 400 // Base score

        // Flags for conditions
        let balanceFlag = 0
        let transfersFlag = 0
        let transferAmountFlag = 0
        let accountAgeFlag = 0

        // Find USDC balance
        const usdcBalance = data.balances.find(
            (balance) => balance.asset_code === 'USDC' && balance.asset_type === 'credit_alphanum4'
        )

        // Currency Balance (only check USDC)
        if (usdcBalance) {
            const balanceAmount = parseFloat(usdcBalance.balance)
            if (balanceAmount > 800) {
                score += 206
                balanceFlag = 5
            } else if (balanceAmount > 500) {
                score += 150
                balanceFlag = 4
            } else if (balanceAmount > 300) {
                score += 120
                balanceFlag = 3
            } else if (balanceAmount > 200) {
                score += 100
                balanceFlag = 2
            } else if (balanceAmount > 100) {
                score += 53
                balanceFlag = 1
            } else if (balanceAmount > 50) {
                score += 27
                balanceFlag = 1
            } else if (balanceAmount > 20) {
                score += 8
                balanceFlag = 1
            } else if (balanceAmount > 10) {
                score += 6
                balanceFlag = 1
            }
        }

        // Filter USDC payments
        const usdcPayments = data.payments.filter(
            (payment) => payment.asset_code === 'USDC' && payment.asset_type === 'credit_alphanum4'
        )
        const numTransfers = usdcPayments.length

        // Number of Transfers
        if (numTransfers > 50) {
            score += 200
            transfersFlag = 5
        } else if (numTransfers > 30) {
            score += 150
            transfersFlag = 4
        } else if (numTransfers > 20) {
            score += 100
            transfersFlag = 3
        } else if (numTransfers > 15) {
            score += 75
            transfersFlag = 2
        } else if (numTransfers > 10) {
            score += 50
            transfersFlag = 1
        } else if (numTransfers > 5) {
            score += 25
            transfersFlag = 1
        } else if (numTransfers > 3) {
            score += 15
            transfersFlag = 1
        } else if (numTransfers > 1) {
            score += 10
            transfersFlag = 1
        }

        // Amount of Transfers
        const totalTransferAmount = usdcPayments.reduce(
            (sum, payment) => sum + parseFloat(payment.amount),
            0
        )
        if (totalTransferAmount > 1000) {
            score += 200
            transferAmountFlag = 5
        } else if (totalTransferAmount > 500) {
            score += 150
            transferAmountFlag = 4
        } else if (totalTransferAmount > 300) {
            score += 120
            transferAmountFlag = 3
        } else if (totalTransferAmount > 200) {
            score += 100
            transferAmountFlag = 2
        } else if (totalTransferAmount > 100) {
            score += 50
            transferAmountFlag = 1
        } else if (totalTransferAmount > 50) {
            score += 25
            transferAmountFlag = 1
        } else if (totalTransferAmount > 20) {
            score += 10
            transferAmountFlag = 1
        } else if (totalTransferAmount > 10) {
            score += 5
            transferAmountFlag = 1
        }

        // Additional Logic: Account Age based on the earliest payment transfer date
        const earliestPayment = data.payments.reduce((earliest, payment) => {
            const paymentDate = new Date(payment.created_at)
            return paymentDate < earliest ? paymentDate : earliest
        }, new Date())

        const accountAgeInDays = (new Date() - earliestPayment) / (1000 * 60 * 60 * 24)
        if (accountAgeInDays > 2 * 365) {
            score += 50
            accountAgeFlag = 2
        } else if (accountAgeInDays > 1 * 365) {
            score += 25
            accountAgeFlag = 1
        } else if (accountAgeInDays > 180) {
            score += 10
            accountAgeFlag = 1
        } else if (accountAgeInDays > 90) {
            score += 8
            accountAgeFlag = 1
        } else if (accountAgeInDays > 30) {
            score += 3
            accountAgeFlag = 1
        }

        // Combination matrix for additional score
        if (balanceFlag >= 3 && transfersFlag >= 3 && transferAmountFlag >= 3) {
            score += 48
        } else if (balanceFlag >= 2 && transfersFlag >= 2 && transferAmountFlag >= 2) {
            score += 19
        } else if (balanceFlag >= 1 && transfersFlag >= 1 && transferAmountFlag >= 1) {
            score += 6
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
