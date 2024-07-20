<!--
@component

The `CreditScore` component displays the user's credit score based on the count of transactions.
-->

<script>
    import { page } from '$app/stores'

    // Calculate the credit score based on the number of transactions
    $: creditScore = $page.data.payments ? $page.data.payments.length : 0
</script>

<h3>Credit Score</h3>
<div class="stats stats-vertical w-full bg-primary text-primary-content shadow lg:stats-horizontal">
    <div class="stat">
        <div class="stat-title">Credit Score</div>
        <div class="stat-value">{creditScore}</div>
    </div>
</div>
