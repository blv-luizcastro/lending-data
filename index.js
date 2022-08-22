const axios = require('axios')
const reader = require('xlsx')

const FILE = reader.readFile('poc_data.xlsx')
const BASE_URL = 'https://development.belvo.com/api/'
const OPTIONS = {
    headers: { 'Accept': 'application/json' },
    auth: {
        username: '',
        password: ''
    }
}

async function fetchAllPages(url, endpoint) {
    let results = []
    let next = false

    try {
        let response = await axios.get((url + endpoint).toString(), OPTIONS)
        for (const item of response.data.results) {
            results.push(item)
        }

        if (response.data.next !== null) {
            next = true
        } else {
            console.log(`The ${endpoint} were successfully fetched.`)
        }

        while (next) {
            response = await axios.get(response.data.next.toString(), OPTIONS)
            for (const item of response.data.results) {
                results.push(item)
            }

            if (response.data.next === null) {
                next = false
                console.log(`The ${endpoint} were successfully fetched.`)
            } else {
                console.log(`Fetching next page: ${response.data.next}`)
            }
        }
    } catch (error) {
        console.log(error)
        next = false
    }

    return results
}

async function GetDataFromAllEndpoints() {
    let incomes_data = [],
        expense_data = [],
        risks_data = []

    const links = await fetchAllPages(BASE_URL, "links")
    const incomes = await fetchAllPages(BASE_URL, "incomes")
    const expenses = await fetchAllPages(BASE_URL, "recurring-expenses")
    const risks = await fetchAllPages(BASE_URL, "risk-insights")

    for (const link of links) {


        const filter_incomes = incomes.filter(item => item.account?.link === link.id)
        for (const income of filter_incomes) {
            incomes_data.push({
                id: income.id,
                link: link.id,
                account__id: income.account.id,
                account__name: income.account.name,
                account__institution_name: income.account.institution.name,
                account__institution_type: income.account.institution.type,
                account__created_at: income.account.created_at,
                account__agency: income.account.agency,
                account__number: income.account.number,
                account__balance_current: income.account.balance.current,
                account__balance_available: income.account.balance.available,
                account__category: income.account.category,
                account__currency: income.account.currency,
                account__loan_data: JSON.stringify(income.account.loan_data),
                account__credit_data: JSON.stringify(income.account.credit_data),
                account__public_identification_name: income.account.public_identification_name,
                account__public_identification_value: income.account.public_identification_value,
                sources: JSON.stringify(income.sources),
                currency: income.currency,
                aggregations: JSON.stringify(income.aggregations)
            })
        }

        const filter_expenses = expenses.filter(item => item.account?.link === link.id)
        for (const expense of filter_expenses) {
            expense_data.push({
                id: expense.id,
                link: link.id,
                name: expense.name,
                category: expense.category,
                frequency: expense.frequency,
                payment_type: expense.payment_type,
                average_transaction_amount: expense.average_transaction_amount,
                median_transaction_amount: expense.median_transaction_amount,
                days_since_last_transaction: expense.days_since_last_transaction,
            })
        }

        const filter_risks = risks.filter(item => item.link === link.id)
        for (const risk of filter_risks) {
            risks_data.push({
                id: risk.id,
                link: link.id,
                loans_metrics__num_accounts: risk.loans_metrics.num_accounts,
                loans_metrics__sum_loans_principal: risk.loans_metrics.sum_loans_principal,
                loans_metrics__sum_loans_monthly_payment: risk.loans_metrics.sum_loans_monthly_payment,
                loans_metrics__sum_loans_outstanding_principal: risk.loans_metrics.sum_loans_outstanding_principal,
                balances_metrics__max_balance_1m: risk.balances_metrics.max_balance_1m,
                balances_metrics__max_balance_1w: risk.balances_metrics.max_balance_1w,
                balances_metrics__max_balance_3m: risk.balances_metrics.max_balance_3m,
                balances_metrics__min_balance_1m: risk.balances_metrics.min_balance_1m,
                balances_metrics__min_balance_1w: risk.balances_metrics.min_balance_1w,
                balances_metrics__min_balance_3m: risk.balances_metrics.min_balance_3m,
                balances_metrics__closing_balance: risk.balances_metrics.closing_balance,
                balances_metrics__balance_threshold_x: risk.balances_metrics.balance_threshold_x,
                balances_metrics__days_balance_below_0_1m: risk.balances_metrics.days_balance_below_0_1m,
                balances_metrics__days_balance_below_0_1w: risk.balances_metrics.days_balance_below_0_1w,
                balances_metrics__days_balance_below_0_3m: risk.balances_metrics.days_balance_below_0_3m,
                balances_metrics__days_balance_below_x_1m: risk.balances_metrics.days_balance_below_x_1m,
                balances_metrics__days_balance_below_x_1w: risk.balances_metrics.days_balance_below_x_1w,
                balances_metrics__days_balance_below_x_3m: risk.balances_metrics.days_balance_below_x_3m,
                cashflow_metrics__sum_negative_1m: risk.cashflow_metrics.sum_negative_1m,
                cashflow_metrics__sum_negative_1w: risk.cashflow_metrics.sum_negative_1w,
                cashflow_metrics__sum_negative_3m: risk.cashflow_metrics.sum_negative_3m,
                cashflow_metrics__sum_positive_1m: risk.cashflow_metrics.sum_positive_1m,
                cashflow_metrics__sum_positive_1w: risk.cashflow_metrics.sum_positive_1w,
                cashflow_metrics__sum_positive_3m: risk.cashflow_metrics.sum_positive_3m,
                cashflow_metrics__positive_to_negative_ratio_1m: risk.cashflow_metrics.positive_to_negative_ratio_1m,
                cashflow_metrics__positive_to_negative_ratio_1w: risk.cashflow_metrics.positive_to_negative_ratio_1w,
                cashflow_metrics__positive_to_negative_ratio_3m: risk.cashflow_metrics.positive_to_negative_ratio_3m,
                credit_cards_metrics__num_accounts: risk.credit_cards_metrics.num_accountsv,
                credit_cards_metrics__sum_credit_used: risk.credit_cards_metrics.sum_credit_used,
                credit_cards_metrics__sum_credit_limit: risk.credit_cards_metrics.sum_credit_limit,
                transactions_metrics__num_transactions_1m: risk.transactions_metrics.num_transactions_1m,
                transactions_metrics__num_transactions_1w: risk.transactions_metrics.num_transactions_1w,
                transactions_metrics__num_transactions_3m: risk.transactions_metrics.num_transactions_3m,
                transactions_metrics__max_incoming_amount_1m: risk.transactions_metrics.max_incoming_amount_1m,
                transactions_metrics__max_incoming_amount_1w: risk.transactions_metrics.max_incoming_amount_1w,
                transactions_metrics__max_incoming_amount_3m: risk.transactions_metrics.max_incoming_amount_3m,
                transactions_metrics__max_outgoing_amount_1m: risk.transactions_metrics.max_outgoing_amount_1m,
                transactions_metrics__max_outgoing_amount_1w: risk.transactions_metrics.max_outgoing_amount_1w,
                transactions_metrics__max_outgoing_amount_3m: risk.transactions_metrics.max_outgoing_amount_3m,
                transactions_metrics__sum_incoming_amount_1m: risk.transactions_metrics.sum_incoming_amount_1m,
                transactions_metrics__sum_incoming_amount_1w: risk.transactions_metrics.sum_incoming_amount_1w,
                transactions_metrics__sum_incoming_amount_3m: risk.transactions_metrics.sum_incoming_amount_3m,
                transactions_metrics__sum_outgoing_amount_1m: risk.transactions_metrics.sum_outgoing_amount_1m,
                transactions_metrics__sum_outgoing_amount_1w: risk.transactions_metrics.sum_outgoing_amount_1w,
                transactions_metrics__sum_outgoing_amount_3m: risk.transactions_metrics.sum_outgoing_amount_3m,
                transactions_metrics__mean_incoming_amount_1m: risk.transactions_metrics.mean_incoming_amount_1m,
                transactions_metrics__mean_incoming_amount_1w: risk.transactions_metrics.mean_incoming_amount_1w,
                transactions_metrics__mean_incoming_amount_3m: risk.transactions_metrics.mean_incoming_amount_3m,
                transactions_metrics__mean_outgoing_amount_1m: risk.transactions_metrics.mean_outgoing_amount_1m,
                transactions_metrics__mean_outgoing_amount_1w: risk.transactions_metrics.mean_outgoing_amount_1w,
                transactions_metrics__mean_outgoing_amount_3m: risk.transactions_metrics.mean_outgoing_amount_3m,
                transactions_metrics__num_incoming_transactions_1m: risk.transactions_metrics.num_incoming_transactions_1m,
                transactions_metrics__num_incoming_transactions_1w: risk.transactions_metrics.num_incoming_transactions_1w,
                transactions_metrics__num_incoming_transactions_3m: risk.transactions_metrics.num_incoming_transactions_3m,
                transactions_metrics__num_outgoing_transactions_1m: risk.transactions_metrics.num_outgoing_transactions_1m,
                transactions_metrics__num_outgoing_transactions_1w: risk.transactions_metrics.num_outgoing_transactions_1w,
                transactions_metrics__num_outgoing_transactions_3m: risk.transactions_metrics.num_outgoing_transactions_3m
            })
        }
    }

    const ws_incomes = reader.utils.json_to_sheet(incomes_data)
    const ws_expenses = reader.utils.json_to_sheet(expense_data)
    const ws_risks = reader.utils.json_to_sheet(risks_data)


    reader.utils.book_append_sheet(FILE, ws_incomes, "Incomes")
    reader.utils.book_append_sheet(FILE, ws_expenses, "Expenses")
    reader.utils.book_append_sheet(FILE, ws_risks, "Risks")

    reader.writeFile(FILE, 'poc_data.xlsx')
}

GetDataFromAllEndpoints()