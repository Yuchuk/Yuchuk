//дэлгэцтэй ажиллах conroller
var uiController = (function () {
    var DOMstrings = {
        inputType: ".add__type",
        inputDescription: ".add__description",
        inputValue: ".add__value",
        addBtn: ".add__btn",
        incomeList: ".income__list",
        expenseList: ".expenses__list",
        tusuvLabel: ".budget__value",
        incomeLabel: ".budget__income--value",
        expeseLabel: ".budget__expenses--value",
        percentageLabel: ".budget__expenses--percentage",
        containerDiv: ".container",
        expensePercantageLabel: ".item__percentage",
        dateLabel: ".budget__title--month"
    };
    var nodeListForEach = function (list, callback) {
        for (var i = 0; i < list.length; i++) {
            callback(list[i], i);
        }
    };
    var formatMoney = function (too) {

    };
    return {
        displayDate: function () {
            var unuudur = new Date();
            document.querySelector(DOMstrings.dateLabel).textContent = unuudur.getMonth() + " сарын ";
        },
    }
    return {
        getInput: function () {
            return {
                type: document.querySelector(DOMstrings.inputType).value, // exp, inc
                description: document.querySelector(DOMstrings.inputDescription).value,
                value: parseInt(document.querySelector(DOMstrings.inputValue).value)
            };
        },
        displayPercentages: function (allPencentages) {
            //зарлагын nodelist-г олох
            var elements = document.querySelectorAll(DOMstrings.expensePercantageLabel);
            //элемент болгоны хувьд зарлагын хувийг авч шивж оруулна
            nodeListForEach(elements, function (el, index) {
                el.textContent = allPencentages[index];
            });
        },
        getDOMstrings: function () {
            return DOMstrings;
        },

        clearFields: function () {
            var fields = document.querySelectorAll(
                DOMstrings.inputDescription + ", " + DOMstrings.inputValue
            );

            // Convert List to Array
            var fieldsArr = Array.prototype.slice.call(fields);

            fieldsArr.forEach(function (el, index, array) {
                el.value = "";
            });

            fieldsArr[0].focus();
        },

        tusviigUzuuleh: function (tusuv) {
            document.querySelector(DOMstrings.tusuvLabel).textContent = tusuv.tusuv;
            document.querySelector(DOMstrings.incomeLabel).textContent =
                tusuv.totalInc;
            document.querySelector(DOMstrings.expeseLabel).textContent =
                tusuv.totalExp;

            if (tusuv.huvi !== 0) {
                document.querySelector(DOMstrings.percentageLabel).textContent =
                    tusuv.huvi + "%";
            } else {
                document.querySelector(DOMstrings.percentageLabel).textContent =
                    tusuv.huvi;
            }
        },

        deleteListItem: function (id) {
            var el = document.getElementById(id);
            el.parentNode.removeChild(el);
        },

        addListItem: function (item, type) {
            // Орлого зарлагын элемент агуулсан html бэлтгэнэ
            var html, list;
            if (type === "inc") {
                list = DOMstrings.incomeList;
                html =
                    '<div class="item clearfix" id="inc-%id%"><div class="item__description">$$DESCRIPTION$$</div><div class="right clearfix"><div class="item__value">$$VALUE$$</div><div class="item__delete">            <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div>        </div></div>';
            } else {
                list = DOMstrings.expenseList;
                html =
                    '<div class="item clearfix" id="exp-%id%"><div class="item__description">$$DESCRIPTION$$</div>          <div class="right clearfix"><div class="item__value">$$VALUE$$</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn">                <i class="ion-ios-close-outline"></i></button></div></div></div>';
            }
            //html дотроо орлого зарлагаа replace ашиглаж өөрчилж өгнө
            html = html.replace("%id%", item.id);
            html = html.replace("$$DESCRIPTION$$", item.description);
            html = html.replace("$$VALUE$$", item.value);
            //Бэтгэсэн html - ээ DOM-д хийж өгнө
            document.querySelector(list).insertAdjacentHTML("beforeend", html);
        }
    };
})();

//санхүүтэй ажиллах conroller
var financeController = (function () {
    // private data
    var Income = function (id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    };

    // private data
    var Expense = function (id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
        this.percentage = -1;
    };

    Expense.prototype.calcPercentage = function (totalIncome) {
        if (totalIncome > 0)
            this.percentage = Math.round((this.value / totalIncome) * 100);
        else this.percentage = 0;
    };

    Expense.prototype.getPercentage = function () {
        return this.percentage;
    };

    var calculateTotal = function (type) {
        var sum = 0;
        data.items[type].forEach(function (el) {
            sum = sum + el.value;
        });

        data.totals[type] = sum;
    };

    // private data
    var data = {
        items: {
            inc: [],
            exp: []
        },

        totals: {
            inc: 0,
            exp: 0
        },

        tusuv: 0,

        huvi: 0
    };

    return {
        tusuvTootsooloh: function () {
            calculateTotal("inc");
            calculateTotal("exp");

            //Төсвийг шинээр тооцоолно
            data.tusuv = data.totals.inc - data.totals.exp;

            // Орлого зарлага хувь тооцоолно
            if (data.totals.inc > 0)
                data.huvi = Math.round((data.totals.exp / data.totals.inc) * 100);
            else data.huvi = 0;
        },

        calculatePercentages: function () {
            data.items.exp.forEach(function (el) {
                el.calcPercentage(data.totals.inc);
            });
        },

        getPercentages: function () {
            var allPercentages = data.items.exp.map(function (el) {
                return el.getPercentage();
            });

            return allPercentages;
        },

        tusviigAvah: function () {
            return {
                tusuv: data.tusuv,
                huvi: data.huvi,
                totalInc: data.totals.inc,
                totalExp: data.totals.exp
            };
        },

        deleteItem: function (type, id) {
            var ids = data.items[type].map(function (el) {
                return el.id;
            });

            var index = ids.indexOf(id);

            if (index !== -1) {
                data.items[type].splice(index, 1);
            }
        },

        addItem: function (type, desc, val) {
            var item, id;

            if (data.items[type].length === 0) id = 1;
            else {
                id = data.items[type][data.items[type].length - 1].id + 1;
            }

            if (type === "inc") {
                item = new Income(id, desc, val);
            } else {
                item = new Expense(id, desc, val);
            }

            data.items[type].push(item);

            return item;
        },

        seeData: function () {
            return data;
        }
    };
})();

//програмын холбогч conroller
var appController = (function (uiController, financeController) {
    var ctrlAddItem = function () {
        //1. оруулах өгөгдөлийг дэлгэцнээс олж авна
        var input = uiController.getInput();

        if (input.description !== "" && input.value !== "") {
            //2. Олж авсан өгөгдлүүдээ санхүүгийн контролорт дамжуулж хадгална
            var item = financeController.addItem(
                input.type,
                input.description,
                input.value
            );
            //3. Олж авсан өгөгдөлөө вэб дээр харуулна
            uiController.addListItem(item, input.type);
            uiController.clearFields();
            //Төсвийг шинээр тооцоолоод дэлгэцэнд үзүүлнэ
            updateTusuv();
        }
    };

    var updateTusuv = function () {
        //4. Төсөв тооцоолно
        financeController.tusuvTootsooloh();

        //5. Эцсийн үлдэгдэл тооцоог дэлгэцэнд гаргана
        var tusuv = financeController.tusviigAvah();
        // 6. Төсвийн тооцоог дэлгэцэнд гаргана
        uiController.tusviigUzuuleh(tusuv);
        //7. Хувь тооцоолно
        financeController.calculatePercentages();
        //элемэнтүүдийн хувийг хүлээж авна
        var allPercentages = financeController.getPercentages();
        //эдгээр хувийг дэлгэцэнд гаргана
        uiController.displayPercentages(allPercentages);
    };

    var setupEventListeners = function () {
        var DOM = uiController.getDOMstrings();

        document.querySelector(DOM.addBtn).addEventListener("click", function () {
            ctrlAddItem();
        });

        document.addEventListener("keypress", function (event) {
            if (event.keyCode === 13 || event.which === 13) {
                ctrlAddItem();
            }
        });

        document
            .querySelector(DOM.containerDiv)
            .addEventListener("click", function (event) {
                var id = event.target.parentNode.parentNode.parentNode.parentNode.id;

                if (id) {
                    // inc-2
                    var arr = id.split("-");
                    var type = arr[0];
                    var itemId = parseInt(arr[1]);

                    console.log(type + " ===> " + itemId);

                    financeController.deleteItem(type, itemId);
                    uiController.deleteListItem(id);
                    updateTusuv();
                }
            });
    };

    return {
        init: function () {
            console.log("Application started...");
            uiController.displayDate();
            uiController.tusviigUzuuleh({
                tusuv: 0,
                huvi: 0,
                totalInc: 0,
                totalExp: 0
            });
            setupEventListeners();
        }
    };
})(uiController, financeController);

appController.init();