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
        }
    }

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
        
        testing: function() {
            console.log(data);
        }
    }

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
    };

    return {
        getInput: function() {
            return {
                type: document.querySelector(DOMStrings.inputType).value,
                description: document.querySelector(DOMStrings.inputDescription).value,
                value: document.querySelector(DOMStrings.inputValue).value,
            }
        },

        addListItem: function(obj, type) {
            let html, newHtml, element;

            // Create HTML string with placeholder text
            if (type === 'inc') {
                element = DOMStrings.incomeContainer;
                
                html = '<div class="item clearfix" id="income-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            } else if (type === 'exp') {
                element = DOMStrings.expensesContainer;

                html = '<div class="item clearfix" id="expense-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            };

            // Replace placeholder text with actual data
            newHtml = html.replace('%id%', obj.id);
            newHtml = newHtml.replace('%description%', obj.description);
            newHtml = newHtml.replace('%value%', obj.value);

            // Insert the HTML into DOM
            document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);
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
        let input, newItem;

        // 1. get the field input data
        input = UICtrl.getInput();
        // console.log(input);

        // 2. add the item to budgetController
        newItem = budgetCtrl.addItem(input.type, input.description, input.value);

        // 3. add the item to UI
        UICtrl.addListItem(newItem, input.type);

        // 4. clear the input fields
        UICtrl.clearFields();

        // 5. calculate the budget

        // 6. display the budget on the UI 

    };

    return {
        init: function() {
            console.log('Application has started!');
            setupEventListeners();
        }
    };

})(budgetController, UIController);

controller.init();