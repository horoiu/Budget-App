///// BUDGET CONTROLLER /////
let budgetController = (function() {

    let Expense = function(id, description , value) {
        this.id = id;
        this.description = description;
        this.value = value;
    };

    let Income = function(id, description , value) {
        this.id = id;
        this.description = description;
        this.value = value;
    }; 

    let data = {
        allItems: {
            exp: [],
            inc: [],
        },
        totals: {
            exp: 0,
            inc: 0,
        },
        budget: 0,
        percentage: -1,   // set it to '-1' instead of '0' so if there is no budget, cannot be any percentage
    };

    let calculateTotal = function(type) {
        let sum = 0;
        data.allItems[type].forEach(function(elem) {
            sum += elem.value;
        });
        data.totals[type] = sum;
    };

    return {
        addItem: function(type, des, val) {
            let newItem, ID;

            // Create new ID  -- ID = lastID + 1;
            if (data.allItems[type].length > 0) {
                ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
            } else {
                ID = 0;
            };

            //Create new item based on 'exp'or 'inc' type
            if (type === 'exp') {
                newItem = new Expense(ID, des, val);
            } else if (type === 'inc') {
                newItem = new Income(ID, des, val);
            };

            // Push the new item into the data structure
            data.allItems[type].push(newItem);

            //Return the new element
            return newItem;
        },
        
        deleteItem: function(type, id) {
            let ids, index;

            ids = data.allItems[type].map(function(element) {
                return element.id;
            });

            index = ids.indexOf(id);

            if (index !== -1) {
                data.allItems[type].splice(index, 1);
            };
        },

        calculateBudget: function() {

            // calculate total income and expences
            calculateTotal('exp');
            calculateTotal('inc');
            
            // calculate the buget: income - expenses
            data.budget = data.totals.inc - data.totals.exp;

            // calculate the percentage of income that we spent
            if (data.totals.inc > 0) {
                data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100);
            } else {
                data.percentage = -1;    // set it to '-1' instead of '0' so if there is no budget, cannot be any percentage
            }
        },

        getBudget: function() {
            console.log(data);
            
            return {
                budget: data.budget,
                totalInc: data.totals.inc,
                totalExp: data.totals.exp,
                percentage: data.percentage,
            };
        },

        testing: function() {
            console.log(data);
        }
    };

})();



///// UI CONTROLLER ///////
let UIController = (function() {

    let DOMStrings = {
        inputType: '.add__type',
        inputDescription: '.add__description',
        inputValue: '.add__value',
        inputBtn: '.add__btn',
        incomeContainer: '.income__list',
        expensesContainer: '.expenses__list',
        budegetLabel: '.budget__value',
        incomeLabel: '.budget__income--value',
        expensesLabel: '.budget__expenses--value',
        percentageLabel: '.budget__expenses--percentage',
        container: '.container',
    };

    return {
        getInput: function() {
            return {
                type: document.querySelector(DOMStrings.inputType).value,
                description: document.querySelector(DOMStrings.inputDescription).value,
                value: parseFloat(document.querySelector(DOMStrings.inputValue).value),
            }
        },

        addListItem: function(obj, type) {
            let html, newHtml, element;

            // Create HTML string with placeholder text
            if (type === 'inc') {
                element = DOMStrings.incomeContainer;
                
                html = '<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            } else if (type === 'exp') {
                element = DOMStrings.expensesContainer;

                html = '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            };

            // Replace placeholder text with actual data
            newHtml = html.replace('%id%', obj.id);
            newHtml = newHtml.replace('%description%', obj.description);
            newHtml = newHtml.replace('%value%', obj.value);

            // Insert the HTML into DOM
            document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);
        },

        deleteListItem: function(selectorID) {
            let el;

            el = document.getElementById(selectorID);
            el.parentNode.removeChild(el);
        },

        clearFields: function() {
            let fields, fieldsArr;

            // select input fields and will return a LIST
            fields = document.querySelectorAll(DOMStrings.inputDescription + ', ' + DOMStrings.inputValue);

            // transform the LIST into an ARRAY by calling an Array method
            fieldsArr = Array.prototype.slice.call(fields);
            fieldsArr.forEach(function(current, index, array) {
                current.value = "";
            });

            // change focus to description field after ENTER or add__btn click
            fieldsArr[0].focus();
        },

        displayBudget: function(obj){
            console.log(obj);
            document.querySelector(DOMStrings.budegetLabel).textContent = obj.budget;
            document.querySelector(DOMStrings.incomeLabel).textContent = obj.totalInc;
            document.querySelector(DOMStrings.expensesLabel).textContent = obj.totalExp;
            
            if (obj.percentage > 0) {
                document.querySelector(DOMStrings.percentageLabel).textContent = obj.percentage + '%';
            } else {
                document.querySelector(DOMStrings.percentageLabel).textContent = '---';
            };
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

        document.querySelector(DOM.container).addEventListener('click', ctrlDeleteItem);
    };

    let ctrlAddItem = function() {
        let input, newItem;

        // 1. get the field input data
        input = UICtrl.getInput();
        // console.log(input);

        if (input.description !== '' && !isNaN(input.value) && input.value > 0) {
            // 2. add the item to budgetController
            newItem = budgetCtrl.addItem(input.type, input.description, input.value);
    
            // 3. add the item to UI
            UICtrl.addListItem(newItem, input.type);
    
            // 4. clear the input fields
            UICtrl.clearFields();
    
            // 5. calculate and update budget
            updateBudget();
        }
    };

    let ctrlDeleteItem = function(event) {
        let itemID, splitID, type, ID;

        itemID = event.target.parentNode.parentNode.parentNode.parentNode.id;

        if (itemID) {

            splitID = itemID.split('-');
            type = splitID[0];
            ID = parseInt(splitID[1]);
            console.log(ID);

            // 1. delete the item from data structure
            budgetCtrl.deleteItem(type, ID);

            // 2. delete the item from the UI
            UICtrl.deleteListItem(itemID);

            // 3. update and show the new budget
            updateBudget();
        };
    };

    let updateBudget = function() {

        // 5. calculate the budget
        budgetCtrl.calculateBudget();

        // 6. return the budget
        let budget = budgetCtrl.getBudget();

        // 7 . display the budget on the UI 
        UICtrl.displayBudget(budget);
    }

    return {
        init: function() {
            console.log('Application has started!');
            UICtrl.displayBudget({
                budget: 0,
                totalInc: 0,
                totalExp: 0,
                percentage: -1,
            });
            setupEventListeners();
        }
    };

})(budgetController, UIController);

controller.init();