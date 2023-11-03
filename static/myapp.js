$('#currency-id').val('USDT');
$("#check-btn").prop('required', true);

$('#terms_and_conditions_agreement_btn').prop('disabled', true);
$('#terms_and_conditions_agreement_btn').removeClass('activate-btn')
convert_currency();
convert_currency('SELL');
get_coin_network();

function numbers_only(evt) {
    var ASCIICode = (evt.which) ? evt.which : evt.keyCode
    if (ASCIICode > 31 && (ASCIICode < 48 || ASCIICode > 57))
        if (ASCIICode == 46) {
            return (true)
        } else {
            return false;
        }
    return true;
}


function validate_form_1(order_type = 'BUY') {
    var coin_amount;
    var coin_name;
    let minimum_amount,maximum_amount,exchange_currency,exchange_rate;

    if (order_type == 'BUY') {
        exchange_rate = $('#xchange_rate_buy').val();
        coin_amount = $('#coin_amount_buy').val();
        exchange_currency = $('#currency_type_buy').val()
        minimum_amount = $('#coin_amount_buy').attr('min');
        maximum_amount = $('#coin_amount_buy').attr('max');
        coin_name = $('#coin_type_buy option:selected').val();

        if (exchange_currency == "Naira") {
           coin_amount = (coin_amount / exchange_rate).toFixed(1);
            
        } else {
            // coin_amount = (coin_amount * exchange_rate).toFixed(1);
        }

    } else {
        coin_amount = $('#coin_amount_sell').val()
        coin_name = $('#coin_type_sell option:selected').val()
    }

    if (parseFloat(minimum_amount) > parseFloat(coin_amount)) {
        $("#error_form_buy_1_2").text('You can only buy from $5 to $1000')
        $("#error_form_buy_1_2").removeClass("removeEffect");
        return false;

    } else if(parseFloat(coin_amount) > parseFloat(maximum_amount)){
       $("#error_form_buy_1_2").text('You can only buy from $5 to $1000')
       $("#error_form_buy_1_2").removeClass("removeEffect");
       return false;

    }else if (!isNaN(coin_amount) == false) {
        return false;
    } else {
        if (!coin_amount || !coin_name) {
            alert("Please Fill All Required Fields");
            return false;
        } else {
            return true;
        }

    }

}


function validate_form_2(order_type='BUY') {

    if (order_type== 'BUY') {
        var wallet_address = $('#wall_address_buy').val()
        var coin_network = $('#coin_network_buy option:selected').val()
    } else {
        var wallet_address = $('#wall_address_sell').val()
        var coin_network = $('#coin_network_sell option:selected').val()
    }

   


    if (!wallet_address || !coin_network) {
        alert("Please Fill All Required Fields");
        return false;
    } else {
        return true;
    }


}

function validate_form_3() {

    var note = $('#note').val();
    var account_name = $('#account_name').val();
    var account_number = $('#Account_number').val();


    var bank_name = $('#bank-name option:selected').val()
    var coin_network = $('#coin_network_sell option:selected').val()



    if (!account_name || !account_number || !bank_name || !coin_network) {
        alert("Please Fill All Required Fields");
        return false;
    } else {
        return true;
    }


}


// function convert_currency(order_type='BUY') {
//     let result;

//     if (order_type=='BUY') {
//         var amount = $('#coin_amount_buy').val();
//         var exchange_currency = $('#currency_type_buy').val()
//         var exchange_rate = $('#xchange_rate_buy').val();
//         var equiv_amnt = document.getElementById("equiv_amnt_buy")
//     } else {
//         var amount = $('#coin_amount_sell').val();
//         var exchange_currency = $('#currency_type_sell').val()
//         var exchange_rate = $('#xchange_rate_sell').val();
//         var equiv_amnt = document.getElementById("equiv_amnt_sell")
//     }
    


//     if (exchange_currency == "Naira") {
//         result = (amount / exchange_rate).toFixed(1);
//         equiv_amnt.innerText = 'Amount in Dollars ' + result;
//     } else {
//         result = (amount * exchange_rate).toFixed(1);
//         equiv_amnt.innerText = 'Amount in Naira ' + result;
//     }

//     $.ajax({
//         url: '/buy_sell',
//         type: 'POST',
//         data: { 'result': result },
//         success: function(response) {
//             // Handle the response here
//         }
//     });


//     return (result)

// }
function convert_currency(order_type='BUY') {
    let result;

    if (order_type == 'BUY') {
        var amount = $('#coin_amount_buy').val();
        var exchange_currency = $('#currency_type_buy').val();
        var exchange_rate = $('#xchange_rate_buy').val();
        var equiv_amnt = document.getElementById("equiv_amnt_buy");
    } else {
        var amount = $('#coin_amount_sell').val();
        var exchange_currency = $('#currency_type_sell').val();
        var exchange_rate = $('#xchange_rate_sell').val();
        var equiv_amnt = document.getElementById("equiv_amnt_sell");
    }

    if (exchange_currency == "Naira") {
        result = (amount / exchange_rate).toFixed(1);
        equiv_amnt.innerText = 'Amount in Dollars ' + result;
    } else {
        result = (amount * exchange_rate).toFixed(1);
        equiv_amnt.innerText = 'Amount in Naira ' + result;
    }

    $.post({
        url: '/buy_sell',
        type: 'POST',
        data: { 'result': result },
        success: function(response) {
            // Handle the response here
        }
    });

    return result;
}


function click_2_convert(order_type='BUY') {
    if (order_type=='BUY') {

        if ($('#usd_ngn_buy').text() == "Set by Naira") {
            $('#usd_ngn_buy').text("Set by Dollar");
            $('#currency_type_buy').val('Naira');
            $('#exchange_currency_buy').text('NGN');
            $('#equiv_amnt_buy').text('Amount in Dollars ---');
            $('#coin_amount_buy').attr("placeholder", "Amount in Naira");
        } else {
            $('#usd_ngn_buy').text("Set by Naira");
            $('#currency_type_buy').val('USDT');
            $('#exchange_currency_buy').text('USD');
            $('#equiv_amnt_buy').text('Amount in Naira ---');
            $('#coin_amount_buy').attr("placeholder", "Amount in Dollar");
        }
        convert_currency();
        
    }
    else{

        if ($('#usd_ngn_sell').text() == "Set by Naira") {
            $('#usd_ngn_sell').text("Set by Dollar");
            $('#currency_type_sell').val('Naira');
            $('#exchange_currency_sell').text('NGN');
            $('#equiv_amnt_sell').text('Amount in Dollars ---');
            $('#coin_amount_sell').attr("placeholder", "Amount in Naira");
        } else {
            $('#usd_ngn_sell').text("Set by Naira");
            $('#currency_type_sell').val('USDT');
            $('#exchange_currency_sell').text('USD');
            $('#equiv_amnt_sell').text('Amount in Naira ---');
            $('#coin_amount_sell').attr("placeholder", "Amount in Dollar");
        }
        convert_currency('SELL');
    }
    
    
    
}


function proceed_2_next_form(order_type='BUY') {
    if (validate_form_1(order_type) == true) {

        if (order_type=='BUY') {
            $("#buy_sell_btn").addClass("removeEffect");
            $("#order_form_buy_1").addClass("removeEffect");
            $("#order_form_buy_2").removeClass("removeEffect");

            var result = convert_currency();
            var coin_amount = $('#coin_amount_buy').val();
            var exchange_currency = $('#currency_type_buy').val();
            var coin_name = $('#coin_type_buy option:selected').val();

            if (exchange_currency == 'Naira') {
                $('#buy_msg').text(`Buying ₦${coin_amount} worth of ${coin_name} at $${result}`)
            } else {
                $('#buy_msg').text(`Buying $${coin_amount} worth of ${coin_name} at ₦${result}`)
            }
        }
        else{
            $("#buy_sell_btn").addClass("removeEffect");
            $("#order_form_sell_1").addClass("removeEffect");
            $("#order_form_sell_2").removeClass("removeEffect");

            var result = convert_currency('SELL');
            var coin_amount = $('#coin_amount_sell').val();
            var exchange_currency = $('#currency_type_sell').val();
            var coin_name = $('#coin_type_sell option:selected').val();

            if (exchange_currency == 'Naira') {
                $('#sell_msg').text(`Selling ₦${coin_amount} worth of ${coin_name} at $${result}`)
            } else {
                $('#sell_msg').text(`Selling $${coin_amount} worth of ${coin_name} at ₦${result}`)
            }
        }


       
    } 
}

function proceed_2_final_form(order_type='BUY') {

    if (order_type=='BUY') {
        if (validate_form_2() == true) {
            $("#buy_sell_btn").addClass("removeEffect");
            $('#order_form_buy_2').addClass('removeEffect');
            $("#order_form_buy_3").removeClass("removeEffect");


            var coin_amount = $('#coin_amount_buy').val();
            var wallet_address = $('#wall_address_buy').val();
            var exchange_currency = $('#currency_type_buy').val()
            var coin_name = $('#coin_type_buy option:selected').val()
            var coin_network = $('#coin_network_buy option:selected').val()


            $('#input_buy_0').val(exchange_currency);
            $('#input_buy_1').val(coin_name);
            $('#input_buy_2').val(coin_amount);
            $('#input_buy_3').val(coin_network);
            $('#input_buy_4').val(wallet_address);
        } 
    } else {


        if (validate_form_3() == true) {
            $('#buy_sell_btn').addClass('removeEffect');
            $("#order_form_sell_2").addClass("removeEffect");
            $("#order_form_sell_3").removeClass("removeEffect");





            var note = $('#note').val();
            var coin_amount = $('#coin_amount_sell').val();
            var account_name = $('#account_name').val();
            var account_number = $('#Account_number').val();
            var exchange_currency = $('#currency_type_sell').val();
            var coin_name = $('#coin_type_sell option:selected').val();
            var bank_name = $('#bank-name option:selected').val();
            var coin_network = $('#coin_network_sell option:selected').val();


           


            $('#input_sell_0').val(exchange_currency);
            $('#input_sell_1').val(coin_name);
            $('#input_sell_2').val(coin_amount);
            $('#input_sell_3').val(bank_name);
            $('#input_sell_4').val(account_name);
            $('#input_sell_5').val(account_number);
            $('#input_sell_6').val(note);
             $('#input_sell_7').val(coin_network);
        }
    }

}




function add_buy_div() {

    $("#buy_div").addClass("active_trade_btn");
    $("#sell_div").removeClass("active_trade_btn");

    $('.sell_order_div').addClass('removeEffect');
    $(".buy_order_div").removeClass("removeEffect");
}


function add_sell_div() {
    $("#sell_div").addClass("active_trade_btn");
    $("#buy_div").removeClass("active_trade_btn");

    $('.buy_order_div').addClass('removeEffect');
    $(".sell_order_div").removeClass("removeEffect");

    
}

$('#usd_ngn_buy').click(function() {
    click_2_convert()
});

$('#usd_ngn_sell').click(function() {
    click_2_convert('SELL')
});

$('#proceed_buy_btn_1').click(function() {
    proceed_2_next_form();
});

$('#proceed_buy_btn_2').click(function() {
    proceed_2_final_form();
});

$('#proceed_sell_btn_1').click(function() {
    proceed_2_next_form('SELL');
});


$('#proceed_sell_btn_2').click(function() {
    proceed_2_final_form('SELL');
});




function func_checked(){
    checkbox = $("input:checkbox[name='i_agree']");
    checkbox.prop('required', true);
    if(checkbox.is(":checked")){
        $('#terms_and_conditions_agreement_btn').prop('disabled', false);
        $('#terms_and_conditions_agreement_btn').addClass('activate-btn')
    }else{
        $('#terms_and_conditions_agreement_btn').prop('disabled', true);
        $('#terms_and_conditions_agreement_btn').removeClass('activate-btn')
    }

}

function copy_order_id(id) {
    const str = id;
    const el = document.createElement('textarea');
    
    el.value = str;
    el.setAttribute('readonly', '');
    el.style.position = 'absolute';
    el.style.left = '-9999px';
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
    alert("successfully copied Order ID");

};



function get_coin_network(){

    if ($(".my_coin_name :selected").val() == "") {
        //pass
    }
    else{
        console.log($(".my_coin_name :selected").val())
         $.post("/buy_sell", {
            Token_name: $(".my_coin_name :selected").val(),
            csrfmiddlewaretoken: document.getElementsByName("csrfmiddlewaretoken")[0].value,
        }).done(function(data) {
            var network_list= `
            <option value="" selected="">Select coin network</option>
            `;

            for (const network of data['my_network']) {

                network_list+=`<option value="${network}">${network}</option>`

            }

            $("#coin_amount_buy").attr({
                   "max" : data['highest_buy'],        // substitute your own
                   "min" : data['lowest_buy'],         // values (or variables) here
                });


            $(".buy_network").empty().append(network_list);
            document.getElementById("buy_error").innerText = `Note :You can only buy from $${data['lowest_buy']} to $${data['highest_buy']}`
            if (data['transfer_fee_naira'] > 0) {
                document.getElementById("buy_warning").innerText = `Note : Buying ${data['token_name']} attracts a ₦${data['transfer_fee_naira']} charge.`

            }else if (data['transfer_fee_dollar'] > 0) {
                document.getElementById("buy_warning").innerText = `Note : Buying ${data['token_name']} attracts a $${data['transfer_fee_dollar']} charge.`

            }else {
                document.getElementById("buy_warning").innerText = ``

            }
            
        })
    }

    if ($(".my_coin_name :selected").val() != "") {

         $('#hide_wallet').removeClass('removeEffect');
        

    }
    else{
         $('#hide_wallet').addClass('removeEffect');
    }

}