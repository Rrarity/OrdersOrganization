/**
 * User: gmn17_000
 * Date: 08.01.14
 * Time: 14:59
 */
(function ($) {
    $(document).ready(function (e) {
        $("#exit").click(function (e) {
            e.preventDefault();
            noty_confirm("Вы уверены, что хотите выйти?", function ($n) {
                return $.get("/my_orders/logout/", function () { //TODO: My_orders
                    return location.href = "/";
                });
                $n.close();
            });
        });

        $("#change_password").click(function (e) {
            e.preventDefault();
            noty_confirm("Вы уверены, что хотите сменить пароль?", function ($n) {
                var $Q = noty_message();
                $.get("/my_orders/change_password/", function (data) { //TODO: My_orders
                    $Q.close();
                    console.log(data);
                    if (data.error_codes.length == 0)
                        noty_alert("Ваш новый пароль: " + data.password);
                });
                $n.close();
            });
        });

        var GRID_HEIGHT = 600;
        var defaultValidator = {
            rules: {
                required: function (input) {
                    if (input.is("[required]")) {
                        return $.trim(input.val()) !== "";
                    } else return true;
                },
                number: function (input) {
                    if (input.is("[number]")) {
                        var reg = new RegExp('^[0-9]+$');
                        return reg.test(input.val());
                    } else return true;
                }
            },
            messages: {
                required: "Поле не может быть пустым",
                number: "Значение этого поля должно быть числом"
            }
        };

        var order_grid = $("#order_grid").kendoGrid({
            dataSource: {
                transport: {
                    read: {
                        url: "/my_orders/get_sessions/", //TODO: My_orders
                        dataType: "json",
                        type: "POST",
                        data: {
                            //type: ""
                        }
                    }
                },
                schema: {
                    data: "sessions",
                    model: {
                        fields: {
                            t_number: { type: "string" },
                            fio: { type: "string" },
                            order_time: { type: "date" },
                            address: { type: "string" },
                            delivery_time: { type: "date" }
                        }
                    }
                },
                aggregate: [
                    { field: "t_number", aggregate: "count" }
                ]
            },
            height: GRID_HEIGHT,
            sortable: true/*{
                mode: "multiple",
                allowUnsort: true
            }*/,
            groupable: {
                messages: {
                    empty: "Перетащите заголовок столбца сюда, чтобы сгруппировать по этому столбцу"
                }
            },
            scrollable: true,
            filterable: {
                extra: true,
                messages: {
                    info: "Показать записи, которые:",
                    and: "и",
                    or: "или",
                    filter: "Применить",
                    clear: "Осистить"
                },
                operators: {
                    string: {
                        startswith: "Начинаются с",
                        contains: "Содержат в себе",
                        endswith: "Заканчмваются на",
                        eq: "Равны",
                        neq: "Не равны"
                    },
                    date: {
                        gte: "С (включительно)",
                        lte: "По (не включительно)"
                    }
                }
              },
//            pageable: {
//                pageSize: 20,
//                //pageSizes: true,
//                messages: {
//                    display: "{0}-{1} из {2} записей",
//                    empty: " ",
//                    previous: "Предыдущая страница",
//                    next: "Следующая страница",
//                    last: "Последняя страница",
//                    first: "Первая страница"
//                }
//            },
            columns: [
                {   title: "Номер телефона",
                    field: "t_number",
                    width: "150px",
                    headerAttributes: {
                        style: "text-align: center;"
                    },
                    attributes: {
                        style: "text-align: center;"
                    },
                    aggregates: [ "count"],
                    footerTemplate: "Всего #: count#",
                    groupFooterTemplate: "Всего #: count#"
                },
                {   title: "Клиент",
                    field: "fio",
                    width: "380px",
                    headerAttributes: {
                        style: "text-align: center;"
                    }
//                    attributes: {
//                        style: "text-align: center;"
//                    }
                },
                {   title: "Время заказа",
                    field: "order_time",
                    template: "#= order_time.toLocaleString()#",
                    width: "150px",
                    headerAttributes: {
                        style: "text-align: center;"
                    },
                    attributes: {
                        style: "text-align: center;"
                    },
                    filterable: {
                        ui: date_filter
                    }
                },
                {   title: "Место доставки",
                    field: "address",
                    width: "",
                    headerAttributes: {
                        style: "text-align: center;"
                    }/*,
                 attributes: {
                 style: "text-align: center;"
                 }*/
                },
                {   title: "Время доставки",
                    field: "delivery_time",
                    template: "#= delivery_time.toLocaleString()#",
                    width: "150px",
                    headerAttributes: {
                        style: "text-align: center;"
                    },
                    attributes: {
                        style: "text-align: center;"
                    },
                    filterable: {
                        ui: date_filter
                    }
                },
                {   command: { name: "Распечать", click: print_order },
                    title: "",
                    width: "140px",
                    attributes: {
                        style: "text-align: center;"
                    }
                }
            ]
        }).data("kendoGrid");

        function date_filter(elm) {
            elm.kendoDatePicker({
                culture: "ru-RU"
            });
        }

        $(window).resize(function () {
            /*            var GRID_HEIGHT = $(window).height() - $("header").height() - $("footer").height() - 60;
             var height = GRID_HEIGHT;
             height = height - 27;
             order_grid.css("height",height+"px");*/
            //console.log("qw");
        });
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        var new_order_window = $("#new_order_form").kendoWindow({
            title: "Добавить заказ",
            modal: true,
            visible: false,
            resizable: false,
            width: 450,
            activate: function (e) {
                $("input[name=def_code]").select();
            }
        }).data("kendoWindow");
        var new_order_model = kendo.observable({
            is_mobile: true,
            country_code: "+7",
            def_code: "",
            phone_number: "",
            home_phone: "",
            type_numbers: [
                {text: "моб.", id: 1},
                {text: "дом.", id: 2}
            ],
            type_number: 1,
            type_number_change: function (e) {
                if (this.get("type_number") == 1)
                    this.set("is_mobile", true);
                else
                    this.set("is_mobile", false);
            },
            phone_change: function (e) {
                var val = e.currentTarget.value;
                var input = e.currentTarget.name
                if ((val.length == 3) && (input == "def_code")) {
                    $("input[name=phone_number]").select();
                } else if ((e.keyCode == 13) && (input == "def_code")) {
                    $("input[name=phone_number]").select();
                } else if ((e.keyCode == 13)) {
                    $("#new_order_save").click();
                }
                //console.log(val.length,input, e)
            }
        });
        kendo.bind($("#new_order"), new_order_model);
        window.new_order_validator = $("#new_order").kendoValidator({
            rules: {
                required: function (input) {
                    if (input.is("[required]")) {
                        return $.trim(input.val()) !== "";
                    } else return true;
                },
                number: function (input) {
                    if (input.is("[number]")) {
                        var reg = new RegExp('^[0-9]+$');
                        return reg.test(input.val());
                    } else return true;
                },
                phone_code: function (input) {
                    if (input.is("[name=country_code]")) {
                        var reg = new RegExp('^\\+[0-9]+$');
                        return reg.test(input.val());
                        console.log(input)
                    } else return true;
                }
            },
            messages: {
                required: "Поле не может быть пустым",
                number: "Значение этого поля должно быть числом",
                phone_code: "Неверный код страны"
            }
        }).data("kendoValidator");
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        var order_window = $("#order_form").kendoWindow({
            title: "Добавить заказ",
            modal: true,
            visible: false,
            resizable: false,
            width: 600
        }).data("kendoWindow");
        var order_model = kendo.observable({
            id: 0,
            phone: "",
            surname: "",
            name: "",
            patronymic: "",
            addresses: [],
            address: "",
            delivery_time: new Date()
        });
        kendo.bind($("#order"), order_model);
        var order_validator = $("#order").kendoValidator(defaultValidator).data("kendoValidator");
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        $(".add_order").click(function (e) {
            e.preventDefault();
            new_order_model.set("is_mobile", true);
            new_order_model.set("type_number", 1);
            new_order_model.set("country_code", "+7");
            new_order_model.set("def_code", "");
            new_order_model.set("phone_number", "");
            new_order_model.set("home_phone", "");
            $(".k-widget.k-tooltip.k-tooltip-validation.k-invalid-msg").hide();
            new_order_window.center().open();
            return false;
        });

        $("#new_order_cancel").click(function (e) {
            new_order_window.close();
            return false;
        });
        $("#order_cancel").click(function (e) {
            order_window.close();
            return false;
        });

        $("#new_order_save").click(function (e) {
            if (!new_order_validator.validateInput($("input[name=country_code]"))) return false;
            if (new_order_model.get("type_number") == 1) {
                if (!new_order_validator.validateInput($("input[name=def_code]"))) return false;
                else if (!new_order_validator.validateInput($("input[name=phone_number]"))) return false;
            } else {
                if (!new_order_validator.validateInput($("input[name=home_phone]"))) return false;
            }
            //if (!new_order_validator.validate()) return false;
            var $Q = noty_message();
            new_order_window.close();
            var send_data = {
                t_number: ""
            };
            if (new_order_model.get("type_number") == 1) {
                send_data.t_number = new_order_model.get("country_code") +
                    new_order_model.get("def_code") +
                    new_order_model.get("phone_number");
            } else {
                send_data.t_number = new_order_model.get("country_code") +
                    new_order_model.get("home_phone");
            }
            $.post("/my_orders/get_add_session_from_number/", JSON.stringify(send_data),   // TODO: my_orders
                function (data) {
                    $Q.close();
                    console.log(data);
                    order_model.set("id", data.client.id);
                    order_model.set("phone", send_data.t_number);
                    order_model.set("surname", data.client.surname);
                    order_model.set("name", data.client.name);
                    order_model.set("patronymic", data.client.patronymic);
                    order_model.set("addresses", data.addresses);
                    order_model.set("address", data.addresses.length > 0 ? data.addresses[0] : "");
                    order_model.set("delivery_time", new Date(new Date().getTime() + 30 * 60000));
                    $(".k-widget.k-tooltip.k-tooltip-validation.k-invalid-msg").hide();
                    order_window.center().open();
                }, "json");
            return false;
        });

        $("#order_save").click(function (e) {
            if (!order_validator.validate()) return false;
            order_window.close();
            var delivery_time = order_model.get("delivery_time");
            delivery_time.setHours(delivery_time.getHours() - delivery_time.getTimezoneOffset() / 60);
            delivery_time = delivery_time.toJSON();
            var send_data = {
                Clientid: order_model.get("id"),
                t_number: order_model.get("phone"),
                name: order_model.get("name"),
                surname: order_model.get("surname"),
                patronymic: order_model.get("patronymic"),
                gender: "",
                birthday: "",
                address: order_model.get("address"),
                delivery_time: delivery_time
            };
            $.post("/my_orders/set_add_session_from_number/", JSON.stringify(send_data),   // TODO: my_orders
                function (data) {
                    console.log(data);
                    order_grid.dataSource.read();
                    if (data.error_codes.length == 0) {
                        show_error("Сохранено.", N_SUCCESS);
                    } else {
                        show_error("Произошла ошибка.");
                    }
                }, "json");
            return false;
        });

    });

    function print_order(e) {
        var dataItem = this.dataItem($(e.currentTarget).closest("tr"));
        var print_template = kendo.template($("#print_template").html());
        var locale_delivery_time = dataItem.delivery_time.toLocaleString(),
            locale_order_time = dataItem.order_time.toLocaleString();
        locale_delivery_time = locale_delivery_time.slice(0,locale_delivery_time.length-3);
        locale_order_time = locale_order_time.slice(0,locale_order_time.length-3);
        var w = window.open();
        $(w.document.body).html(print_template({
            phone: dataItem.t_number,
            fio: dataItem.fio,
            address: dataItem.address,
            delivery_time: locale_delivery_time,
            order_time: locale_order_time
        }));
        console.log(dataItem)
    }
})(jQuery);