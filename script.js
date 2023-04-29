const $transactionUl            = document.getElementById("transactions") 
const    $balance               = document.getElementById('balance')
const    $income                = document.getElementById('money-plus')
const   $expenses               = document.getElementById('money-minus')
const     $form                 = document.getElementById('form')
const $inpuTransactionName      = document.getElementById('text')
const $inpuTransactionAmount    = document.getElementById('amount')



const localStorageTransactions = JSON.parse(localStorage.getItem('transaction'))
let   transactions =  localStorage.getItem('transactions') !== null ? localStorageTransactions : []

const removeTransaction = ID => {
    
    transactions = transactions.filter(transaction => transaction.id !== ID)
    
    updateLocalStorage()
    init()
}

const addtransactionIntoDOM = ({ id, name, amount }) => {
   
    const        operator       = amount < 0 ? '-' : '+'
    const        CSSClass       = amount < 0 ? 'minus' : 'plus'
    const amountWithoutOperator = Math.abs(amount)
    const          li           = document.createElement('li')

    li.classList.add(CSSClass)
    li.innerHTML = 
    `        
        ${name} <span>${operator} R$ ${amountWithoutOperator}</span>
        <button class="delete-btn" onClick="removeTransaction(${id})">
         x 
        </button>
    `
    $transactionUl.append(li)    
}

const getExpenses = transactionAmount => Math.abs(transactionAmount
    .filter(value => value < 0)
    .reduce((acumulator, transaction) => acumulator + transaction , 0))
    .toFixed(2)
 
 const getIncome  = transactionAmount => transactionAmount
     .filter(value => value > 0)
     .reduce((acumulator, transaction) => acumulator + transaction, 0)
     .toFixed(2)

 const getTotal   = transactionAmount => transactionAmount
 .reduce((acumulator, transaction) => acumulator + transaction, 0)

const updateBalanceValues = () => { 

    
    const  transactionAmount    = transactions.map(({amount}) => amount)
    const        total          = getTotal(transactionAmount)
    const        income         = getIncome(transactionAmount)
    const        expense        = getExpenses(transactionAmount)
    
    const totalWithoutOperator  = Math.abs(total).toFixed(2)
    const       operator        = total < 0 ? '-' : ''    
//  Devemos pensar na possibilidade de o saldo atual ser negativo
    const       CSSClass        = total < 0 ?  'balance-negative' : 'balance' 
    $balance.classList.add(CSSClass)
    
    $balance.textContent    = `${operator} R$ ${total}`
    $income.innerText       = `+ R$ ${income}`
    $expenses.innerText     = `- R$ ${expense}`
}


const init = () => {
    $transactionUl.innerText = ''
    transactions.forEach(addtransactionIntoDOM)
    updateBalanceValues()
}

init()

const updateLocalStorage =  () =>   {    
    localStorage.setItem('transactions', JSON.stringify(transactions))
}

const generateID            = () => Math.round(Math.random() * 1000)
const addToTransactionArray = (transactionName, transactionAmount) => {
    transactions.push({
        id: generateID(),
        name: transactionName,
        amount: Number(transactionAmount)
    })
}

const cleanInput = () => {
    $inpuTransactionAmount.value   = ''
    $inpuTransactionName.value      = ''    
}

const handleFormSubmit  = event => {
    event.preventDefault()

    const transactionName   = $inpuTransactionName.value.trim()
    const transactionAmount = $inpuTransactionAmount.value.trim()
    const isSomeInputEmpty  = transactionName === '' || transactionAmount === ''

    
    if(isSomeInputEmpty){
        alert(`Por favor, preencha tanto o nome como o valor da transação`)
        return
    }
    
    addToTransactionArray(transactionName, transactionAmount)    
    init()
    updateLocalStorage()

}

$form.addEventListener('submit', handleFormSubmit)