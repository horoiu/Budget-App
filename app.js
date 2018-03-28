///// BUDGET CONTROLLER /////
let budgetController = (function() {

    // Some code

})();



///// UI CONTROLLER ///////
let UIController = (function() {

    let DOMStrings = {
        inputType: '.add__type',
        inputDescription: '.add__description',
        inputValue: '.add__value',
        inputBtn: '.add__btn',
    };

    return {
        getInput: function() {
            return {
                type: document.querySelector(DOMStrings.inputType).value,
                description: document.querySelector(DOMStrings.inputDescription).value,
                value: document.querySelector(DOMStrings.inputValue).value,
            }
        },

        getDOMStrings: function() {
            return DOMStrings;
        },
    }
})();




///// GLOBAL APP CONTROLLER /////
let controller = (function(budgetCtrl, UICtrl) {

    let setupEventListeners = function() {
        let DOM = UICtrl.getDOMStrings();

        document.querySelector(DOM.inputBtn).addEventListener('click', ctrlAddItem);

        document.addEventListener('keypress', function(event) {
            if (event.keyCode === 13 || event.which === 13) {
                ctrlAddItem();
            }
        });
    };

    let ctrlAddItem = function() {

        // 1. get the field input data
        let input = UICtrl.getInput();
        console.log(input);

        // 2. add the item to budgetController

        // 3. add the item to UI

        //4. calculate the budget

        //5. display the budget on the UI 

    };

    return {
        init: function() {
            console.log('Application has started!');
            setupEventListeners();
        }
    };

})(budgetController, UIController);

controller.init();