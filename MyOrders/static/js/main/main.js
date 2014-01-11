/**
 * User: gmn17_000
 * Date: 08.01.14
 * Time: 14:59
 */
(function($) {
    $(document).ready(function(e) {
        $("#exit").click(function(e) {
            e.preventDefault();
            noty_confirm("Вы уверены, что хотите выйти?", function($n) {
                return $.get("/my_orders/logout/", function() { //TODO: My_orders
                    return location.href = "/";
                });
                $n.close();
            });
        });

        $("#change_password").click(function(e) {
            e.preventDefault();
            noty_confirm("Вы уверены, что хотите сменить пароль?", function($n) {
                var $Q = noty_message();
                $.get("/my_orders/change_password/", function(data) { //TODO: My_orders
                    $Q.close();
                    console.log(data);
                    if (data.error_codes.length == 0)
                        noty_alert("Ваш новый пароль: "+data.password);
                });
                $n.close();
            });
        });

        var GRID_HEIGHT = 600;

        var order_grid = $("#order_grid").kendoGrid({
           dataSource: {
               transport: {
                   read: {
                       url: "/my_orders/get_sessions/", //TODO: My_orders
                            dataType: "json",
                            type: "POST",
                            data: {
                                //type: "documents"
                       }
                   }
               },
               schema: {
                   data: "sessions"
               }
           },
            height: GRID_HEIGHT,
            columns: [
                {   title: "Номер телефона",
                    field: "t_number",
                    width: "150px",
                    headerAttributes: {
                        style: "text-align: center;"
                    },
                    attributes: {
                        style: "text-align: center;"
                    }
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
                    width: "150px",
                    headerAttributes: {
                        style: "text-align: center;"
                    },
                    attributes: {
                        style: "text-align: center;"
                    }
                },
                {   title: "Место доставки",
                    field: "",
                    width: "",
                    headerAttributes: {
                        style: "text-align: center;"
                    },
                    attributes: {
                        style: "text-align: center;"
                    }
                },
                {   title: "Время доставки",
                    field: "delivery_time",
                    width: "150px",
                    headerAttributes: {
                        style: "text-align: center;"
                    },
                    attributes: {
                        style: "text-align: center;"
                    }
                }
            ]
        });

        $( window ).resize(function() {
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
            width: 450
        }).data("kendoWindow");
        var new_order_model = kendo.observable({
            is_mobile: true,
            country_code: "+7",
            def_code: "",
            phone_number: "",
            home_phone: "",
            type_numbers: [{text: "моб.", id:1},{text: "дом.", id:2}],
            type_number: 1,
            type_number_change: function(e) {
                if (this.get("type_number") == 1)
                    this.set("is_mobile",true);
                else
                    this.set("is_mobile",false);
            }
        });
        kendo.bind($("#new_order"), new_order_model);
        //var nomenclatureValidator = $("#changeNomenclature").kendoValidator(defaultValidator).data("kendoValidator");
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        var order_window = $("#order_form").kendoWindow({
            title: "Добавить заказ",
            modal: true,
            visible: false,
            resizable: false,
            width: 600
        }).data("kendoWindow");
        window.order_model = kendo.observable({
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
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        $(".add_order").click(function(e) {
            e.preventDefault();
            new_order_model.set("is_mobile",true);
            new_order_model.set("type_number",1);
            new_order_model.set("country_code","+7");
            new_order_model.set("def_code","");
            new_order_model.set("phone_number","");
            new_order_model.set("home_phone","");
            new_order_window.center().open();
            return false;
        });

        $("#new_order_cancel").click(function(e) {
            new_order_window.close();
            return false;
        });
        $("#order_cancel").click(function(e) {
            order_window.close();
            return false;
        });

        $("#new_order_save").click(function(e) {
            var $Q = noty_message();
            new_order_window.close();
            var send_data = {
                t_number: ""
            };
            if (new_order_model.get("type_number") == 1) {
                send_data.t_number = new_order_model.get("country_code")+
                    new_order_model.get("def_code")+
                    new_order_model.get("phone_number");
            } else {
                send_data.t_number = new_order_model.get("country_code")+
                    new_order_model.get("home_phone");
            }
            $.post("/my_orders/get_add_session_from_number/", JSON.stringify(send_data),   // TODO: my_orders
                function(data) {
                    $Q.close();
                    console.log(data);
                    order_model.set("id",data.client.id);
                    order_model.set("phone",send_data.t_number);
                    order_model.set("surname",data.client.surname);
                    order_model.set("name",data.client.name);
                    order_model.set("patronymic",data.client.patronymic);
                    order_model.set("addresses",data.addresses);
                    order_model.set("address","");
                    order_window.center().open();
                },"json");
            return false;
        });

        $("#order_save").click(function(e) {
            order_window.close();
            var send_data = {
                Clientid: order_model.get("id"),
                t_number: order_model.get("phone"),
                name: order_model.get("name"),
                surname: order_model.get("surname"),
                patronymic: order_model.get("patronymic"),
                gender: "",
                birthday: "",
                address: order_model.get("address"),
                delivery_time: order_model.get("delivery_time")
            };
            $.post("/my_orders/set_add_session_from_number/", JSON.stringify(send_data),   // TODO: my_orders
                function(data) {
                    console.log(data);
                    if (data.error_codes.length == 0) {
                        show_error("Сохранено.",N_SUCCESS);
                    } else {
                        show_error("Произошла ошибка.");
                    }

                },"json");
            return false;
        });

    });
})(jQuery);