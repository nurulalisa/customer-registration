App = {
  loading: false,
  contracts: {},

  load: async () => {
    await App.loadWeb3()
    await App.loadAccount()
    await App.loadContract()
    await App.render()
  },

  // https://medium.com/metamask/https-medium-com-metamask-breaking-change-injecting-web3-7722797916a8
  loadWeb3: async () => {
    if (typeof web3 !== 'undefined') {
      App.web3Provider = web3.currentProvider
      web3 = new Web3(web3.currentProvider)
    } else {
      window.alert("Please connect to Metamask.")
    }
    // Modern dapp browsers
    if (window.ethereum) {
      window.web3 = new Web3(ethereum)
      try {
        // Request account access if needed
        await ethereum.enable()
        // Acccounts now exposed
        web3.eth.sendTransaction({/* ... */})
      } catch (error) {
        // User denied account access
      }
    }
    // Legacy dapp browsers
    else if (window.web3) {
      App.web3Provider = web3.currentProvider
      window.web3 = new Web3(web3.currentProvider)
      // Acccounts always exposed
      web3.eth.sendTransaction({/* ... */})
    }
    // Non-dapp browsers
    else {
      console.log('Non-Ethereum browser detected. You should consider trying MetaMask!')
    }
  },

  loadAccount: async () => {
    // Set the current blockchain account
    App.account = web3.eth.accounts[0]
  },

  loadContract: async () => {
    // Create a JavaScript version of the smart contract
    const formList = await $.getJSON('FormList.json')
    App.contracts.FormList = TruffleContract(formList)
    App.contracts.FormList.setProvider(App.web3Provider)

    // Hydrate the smart contract with values from the blockchain
    App.formList = await App.contracts.FormList.deployed()
  },

  render: async () => {
    // Prevent double render
    if (App.loading) {
      return
    }

    // Update app loading state
    App.setLoading(true)

    // Render Account
    $('#account').html(App.account)

    // Render forms
    await App.renderForms()

    // Update loading state
    App.setLoading(false)
  },

  renderForms: async () => {
    // Load the total form count from the blockchain
    const formCount = await App.formList.formCount()
    const $formTemplate = $('.formTemplate')

    // Render out each form with a new form template
    for (var i = 1; i <= formCount; i++) {
      // Fetch the form data from the blockchain
      const form = await App.formList.forms(i)
      const formId = form[0].toNumber()
      const formContent = form[1]
      const formCompleted = form[2]

      // Create the html for the form
      const $newFormTemplate = $formTemplate.clone()
      $newFormTemplate.find('.content').html(formContent)
      $newFormTemplate.find('input')
                      .prop('name', formId)
                      .prop('checked', formCompleted)
                      .on('click', App.toggleCompleted)

      // Put the form in the correct list
      if (formCompleted) {
        $('#completedFormList').append($newFormTemplate)
      } else {
        $('#formList').append($newFormTemplate)
      }

      // Show the Form
      $newFormTemplate.show()
    }
  },

  createForm: async () => {
    App.setLoading(true)
    const content = $('#newForm').val()
    await App.formList.createForm(content)
    window.location.reload()
  },

  toggleCompleted: async (e) => {
    App.setLoading(true)
    const formId = e.target.name
    await App.formList.toggleCompleted(formId)
    window.location.reload()
  },

  setLoading: (boolean) => {
    App.loading = boolean
    const loader = $('#loader')
    const content = $('#content')
    if (boolean) {
      loader.show()
      content.hide()
    } else {
      loader.hide()
      content.show()
    }
  }
}

$(() => {
  $(window).load(() => {
    App.load()
  })
})
