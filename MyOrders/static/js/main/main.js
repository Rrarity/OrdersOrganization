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
                $.get("/my_orders/change_password/", function(data) { //TODO: My_orders
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
                            url: "/my_orders//", //TODO: My_orders
                            dataType: "json",
                            type: "POST",
                            data: {
                                //type: "documents"
                            }
                        }
                }
           },
            height: GRID_HEIGHT,
            columns: [
                {
                    title: "",
                    field: "",
                    width: "",
                    headerAttributes: {
                        style: "text-align: center;"
                    },
                    attributes: {
                        style: "text-align: center;"
                    },
                    template: ""
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

        var change_order_window = $("#change_order_form").kendoWindow({
            title: "Добавить заказ",
            modal: true,
            visible: false,
            resizable: false,
            width: 650
        }).data("kendoWindow");

        var change_order_model = kendo.observable({
            id: 0,
            clients: [],
            client_id: "",
            phones: [],
            phone_id: "",
            address: "",
            delivery_time: new Date()
        });
        kendo.bind($("#change_order"), change_order_model);

        //var nomenclatureValidator = $("#changeNomenclature").kendoValidator(defaultValidator).data("kendoValidator");

        $(".add_order").click(function(e) {
            e.preventDefault();
            change_order_window.center().open();
            return false;
        })

    });
})(jQuery);