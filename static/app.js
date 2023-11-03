
function activateActiveClass(a,p,d, x,y,z, parentElementA, parentElementP, parentElementD){
    if(x == 1){
        // approved
        a.addClass('activeTable'); 
        p.removeClass('activeTable'); 
        d.removeClass('activeTable');

        $(parentElementA).show();
        $(parentElementP).hide();
        $(parentElementD).hide(); 

    }else if(y == 1){
        // pending
        a.removeClass('activeTable'); 
        p.addClass('activeTable'); 
        d.removeClass('activeTable');

        $(parentElementA).hide();
        $(parentElementP).show();
        $(parentElementD).hide(); 

    }else if(z == 1){
        // declined
        a.removeClass('activeTable'); 
        p.removeClass('activeTable'); 
        d.addClass('activeTable');

        $(parentElementA).hide();
        $(parentElementP).hide();
        $(parentElementD).show();

    }
}


if ($("#id_bvn").hasClass("valid-bvn")) {
  $("#unverified").addClass("hide-warning");
}


if ($("#id_bvn").hasClass("pending_bvn")) {
  $("#unverified").addClass("hide-warning");
  $("#pending_bvn").removeClass("hide-warning");
}


if ($("#id_nin").hasClass("valid-bvn")) {
  $("#unverified").addClass("hide-warning");
}


if ($("#id_nin").hasClass("pending_bvn")) {
  $("#unverified_nin").addClass("hide-warning");
  $("#pending_nin").removeClass("hide-warning");

}



// sell section
$('.sell_sec #approved').click(function(){
    activateActiveClass($('.sell_sec #approved'), $('.sell_sec #pending'), $('.sell_sec #declined'), 1,0,0, $('.sell_sec .approved'), $('.sell_sec .pending'), $('.sell_sec .declined'))
});
$('.sell_sec #pending').click(function(){
    activateActiveClass($('.sell_sec #approved'), $('.sell_sec #pending'), $('.sell_sec #declined'), 0,1,0, $('.sell_sec .approved'), $('.sell_sec .pending'), $('.sell_sec .declined'))
});
$('.sell_sec #declined').click(function(){
    activateActiveClass($('.sell_sec #approved'), $('.sell_sec #pending'), $('.sell_sec #declined'), 0,0,1, $('.sell_sec .approved'), $('.sell_sec .pending'), $('.sell_sec .declined'))
});
/* end of sell section */

// buy section
$('.buy_sec #approved').click(function(){
    activateActiveClass($('.buy_sec #approved'), $('.buy_sec #pending'), $('.buy_sec #declined'), 1,0,0, $('.buy_sec .approved'), $('.buy_sec .pending'), $('.buy_sec .declined'))
});
$('.buy_sec #pending').click(function(){
    activateActiveClass($('.buy_sec #approved'), $('.buy_sec #pending'), $('.buy_sec #declined'), 0,1,0, $('.buy_sec .approved'), $('.buy_sec .pending'), $('.buy_sec .declined'))
});
$('.buy_sec #declined').click(function(){
    activateActiveClass($('.buy_sec #approved'), $('.buy_sec #pending'), $('.buy_sec #declined'), 0,0,1, $('.buy_sec .approved'), $('.buy_sec .pending'), $('.buy_sec .declined'))
});

// // Toggle buy form

var buy = $('#buy_sec');
var sell = $('#sell_sec');
buy.click(function(){
    buy.addClass('activate');
    sell.removeClass('activate');

    $('.sell_sec').hide();
    $('.buy_sec').show();
});


sell.click(function(){
    sell.addClass('activate');
    buy.removeClass('activate');

    $('.sell_sec').show();
    sell.fontcolor = 'blue';
    $('.buy_sec').hide();
    buy.fontcolor = 'red';
});


// For withdrawal page

var pend = $('#pend');
var paid = $('#paid');
var invalid = $('#invalid');
pend.click(function(){
    pend.addClass('activeTable');
    paid.removeClass('activeTable');
    

    $('.paid').hide();
    $('.pending').show();
    $('.invalid').hide();
    invalid.removeClass('activeTable');

});

paid.click(function(){
    paid.addClass('activeTable');
    pend.removeClass('activeTable');

    
    $('.paid').show();
    $('.pending').hide();
    $('.invalid').hide();
    invalid.removeClass('activeTable');
    
  

});

invalid.click(function(){
    invalid.addClass('activeTable');
    pend.removeClass('activeTable');
    paid.removeClass('activeTable');
    

    $('.paid').hide();
    $('.pending').hide();
    $('.invalid').show();

});


// $(element).attr('placeholder', placeholder text)
var c_input = $('#amnt_dolls');
var n_holder = $('#naira');
var dolls = $('#us-dolls');
var equiv = $('#equiv_text');
var currency = document.getElementById('currency-id');
//var amount = document.getElementById("amnt_dolls").value

n_holder.click(function(){

    n_holder.addClass('selected');
    dolls.removeClass('selected');
    currency.value = "Naira";

    //amount = document.getElementById("amnt_dolls").value
    //document.getElementById("amnt_dolls").value = dyno_update(amount)

    c_input.attr("Placeholder", "Amount in Naira");
    equiv.html("Equivalent in Dollar <span style='color:#222'>$</span>");
});

dolls.click(function(){

    dolls.addClass('selected');
    n_holder.removeClass('selected');
    currency.value = "USDT";

    //amount = document.getElementById("amnt_dolls").value;
    //x = document.getElementById("equiv_amnt").innerText;
    //document.getElementById("equiv_amnt").innerText = dyno_update(x);
    //alert document.getElementById("equiv_amnt").innerText

    c_input.attr("Placeholder", "Amount in Dollar");
    equiv.html("Equivalent in Naira <span style='color:#222'>&#8358;</span>");
});


function update(){
    var x = document.getElementById("amnt_dolls").value;
    var xchange = document.getElementById("xchange-rate").value;

    if (currency.value == "Naira") {
        document.getElementById("equiv_amnt").innerText = (x/xchange).toFixed(1);
    }else{
        document.getElementById("equiv_amnt").innerText = (x*xchange).toFixed(1);
    }
    
}



function dynamic_update(){
    var x = document.getElementById("amnt_dolls").value;
    var xchange = document.getElementById("xchange-rate").value;

    if (currency.value == "Naira") {
        document.getElementById("equiv_amnt").innerText = (x/xchange).toFixed(1);
    }else{
        document.getElementById("equiv_amnt").innerText = (x*xchange).toFixed(1);
    }
};


$('#usd-ngn').click(function(){
dynamic_update();
});

$("#check-btn").prop('required', true);

$("#coin_network").prop('required', true);

// $(".my_wallet_choice").prop('required', false);


function get_percentage(){

    if ($(".my_coin_name :selected").text() == "Select coin name") {
        //pass
    }
    else{
         $.post("/buy_sell", {
            Token_name: $(".my_coin_name :selected").text(),
            csrfmiddlewaretoken: document.getElementsByName("csrfmiddlewaretoken")[0].value,
        }).done(function(data) {
            var network_list= `
            <option value="" selected="">Select coin network</option>
            `;

            for (const network of data['my_network']) {

                network_list+=`<option value="${network}">${network}</option>`

            }

            $(".buy_network").empty().append(network_list);
            if (data['transfer_fee_naira'] > 0) {
                document.getElementById("buy_warning").innerText = `Note : Buying ${data['token_name']} attracts a ₦${data['transfer_fee_naira']} charge.`
            }else if (data['transfer_fee_dollar'] > 0) {
                document.getElementById("buy_warning").innerText = `Note : Buying ${data['token_name']} attracts a $${data['transfer_fee_dollar']} charge.`

            }else {
                document.getElementById("buy_warning").innerText = `Pay from your account`

            }
            
        })
    }

    if ($(".my_coin_name :selected").text() != "Select coin name") {

         $('#hide_wallet').removeClass('hide_wallet_choice');
        

    }
    else{
         $('#hide_wallet').addClass('hide_wallet_choice');
    }

}


function claim_refund(category,txn_id){
    $('#fialedTransaction').addClass('removeEffect');
    $('#pendingTransaction').addClass('removeEffect');
    $('#completeTransaction').addClass('removeEffect');
    $('#Sell-refund-form').addClass('removeEffect');
    $('#buy-refund-form').addClass('removeEffect');
    // $('.shadow').addClass('removeEffect');

    console.log(category,txn_id)

    if (category == 'Sell') {
         $("#txn_sell_id").val(txn_id);
         $('#Sell-refund-form').removeClass('removeEffect');
    } else {
         $("#txn_buy_id").val(txn_id);
         $('#buy-refund-form').removeClass('removeEffect');
    }
    
    $('#report_txn_form').css({'display': 'block'});
}




$('.canceled_txn').click(function(){
    var date = this.querySelector("#timestamp").innerText;

   $.post("/exchange/get_order_info/", {
            order_id: this.id,
        }).done(function(data) {


    var html_data_buy = `

        <div class="pop-receipt-info">
            <div class="pop-receipt-keys">
                        
                <p>Category</p>
                <br>
                <p>Coin</p>
                <br>
                <p>Network</p>
                <br>
                <p>Address</p>
            </div>
            <div class="pop-receipt-values">
                <p>${data['category']}</p>
                <br>
                <p>${data['token']}</p>
                <br>
                <p>${data['network']}</p>
                <br>
                <p style="max-width: 150px;overflow-wrap: break-word;width: 100%;">${data['address']}</p>
            </div>
        </div>

        <div class="pop-receipt-info">
            <div class="pop-receipt-keys">
                        
                <p>Amount</p>
                <br>
                <p>Time stamp</p>
                <br>
                <p>Order ID</p>
            </div>
            <div class="pop-receipt-values">
                <p>${data['amount']}</p>
                <br>
                <p>${data['date']}</p>
                <br>
                <p id="txn_id" style="max-width: 150px;overflow-wrap: break-word;width: 100%;">${data['order_id']}</p>
            </div>
        </div>
    `

    var html_data_sell = `

        <div class="pop-receipt-info">
            <div class="pop-receipt-keys">
                        
                <p>Category</p>
                <br>
                <p>Coin</p>
                <br>
                <p>Bank name</p>
                <br>
                <p>Account number</p>
                <br>
                <p>Account name</p>
            </div>
            <div class="pop-receipt-values">
                <p>${data['category']}</p>
                <br>
                <p>${data['token']}</p>
                <br>
                <p>${data['Bank_name']}</p>
                <br>
                <p>${data['Account_number']}</p>
                <br>
                <p>${data['Account_name']}</p>
            </div>
        </div>

        <div class="pop-receipt-info">
            <div class="pop-receipt-keys">
                        
                <p>Amount</p>
                <br>
                <p>Time stamp</p>
                <br>
                <p>Order ID</p>
            </div>
            <div class="pop-receipt-values">
                <p>${data['amount']}</p>
                <br>
                <p>${data['date']}</p>
                <br>
                <p id="txn_id" style="max-width: 150px;overflow-wrap: break-word;width: 100%;">${data['order_id']}</p>
            </div>
        </div>
    `

    var html_data = ``
    var html_data_2 = `<span onclick="copy_order_id('${data['order_id']}')"><p style="text-align: center;font-size: 14px;margin: -30px 0 40px;font-family: Poppins;font-style: normal;font-weight: normal;line-height: 135%;color: #229de2;">Copy Order ID</p></span>`
    var report_trade = `<a href="https://t.me/{{site.name}}SupportBot?start=${data['order_id']}"><span><p style="text-align: center;font-size: 14px;margin: -30px 0 40px;font-family: Poppins;font-style: normal;font-weight: normal;line-height: 135%;color: #EB5757;">Report Trade</p></span></a>`
    

    if (data['category'] == 'Sell') {

        html_data = html_data_sell+html_data_2+report_trade

    } else {

        html_data = html_data_buy+html_data_2+report_trade
    }

    
    $('#canceledTransaction').removeClass('removeEffect');
    $('#trans_details_canceled').html(html_data);
    $('.shadow').removeClass('removeEffect');
    })
});

$('.pending_txn').click(function(){
    var date = this.querySelector("#timestamp").innerText;

   $.post("/exchange/get_order_info/", {
            order_id: this.id,
        }).done(function(data) {


    var html_data_buy = `

        <div class="pop-receipt-info">
            <div class="pop-receipt-keys">
                        
                <p>Category</p>
                <br>
                <p>Coin</p>
                <br>
                <p>Network</p>
                <br>
                <p>Address</p>
            </div>
            <div class="pop-receipt-values">
                <p>${data['category']}</p>
                <br>
                <p>${data['token']}</p>
                <br>
                <p>${data['network']}</p>
                <br>
                <p style="max-width: 150px;overflow-wrap: break-word;width: 100%;">${data['address']}</p>
            </div>
        </div>

        <div class="pop-receipt-info">
            <div class="pop-receipt-keys">
                        
                <p>Amount</p>
                <br>
                <p>Time stamp</p>
                <br>
                <p>Order ID</p>
            </div>
            <div class="pop-receipt-values">
                <p>${data['amount']}</p>
                <br>
                <p>${data['date']}</p>
                <br>
                <p id="txn_id" style="max-width: 150px;overflow-wrap: break-word;width: 100%;">${data['order_id']}</p>
            </div>
        </div>
    `

    var html_data_sell = `

        <div class="pop-receipt-info">
            <div class="pop-receipt-keys">
                        
                <p>Category</p>
                <br>
                <p>Coin</p>
                <br>
                <p>Bank name</p>
                <br>
                <p>Account number</p>
                <br>
                <p>Account name</p>
            </div>
            <div class="pop-receipt-values">
                <p>${data['category']}</p>
                <br>
                <p>${data['token']}</p>
                <br>
                <p>${data['Bank_name']}</p>
                <br>
                <p>${data['Account_number']}</p>
                <br>
                <p>${data['Account_name']}</p>
            </div>
        </div>

        <div class="pop-receipt-info">
            <div class="pop-receipt-keys">
                        
                <p>Amount</p>
                <br>
                <p>Time stamp</p>
                <br>
                <p>Order ID</p>
            </div>
            <div class="pop-receipt-values">
                <p>${data['amount']}</p>
                <br>
                <p>${data['date']}</p>
                <br>
                <p id="txn_id" style="max-width: 150px;overflow-wrap: break-word;width: 100%;">${data['order_id']}</p>
            </div>
        </div>
    `

    var html_data = ``
    var html_data_2 = `<span onclick="copy_order_id('${data['order_id']}')"><p style="text-align: center;font-size: 14px;margin: -30px 0 40px;font-family: Poppins;font-style: normal;font-weight: normal;line-height: 135%;color: #229de2;">Copy Order ID</p></span>`
    var refund_user = `<span onclick="claim_refund('${data['category']}','${data['order_id']}')"><p style="text-align: center;font-size: 14px;margin: -30px 0 40px;font-family: Poppins;font-style: normal;font-weight: normal;line-height: 135%;color: #EB5757;">Cancel Trade</p></span>`
    

    if (data['category'] == 'Sell') {

        html_data = html_data_sell+html_data_2//+refund_user

    } else {

        html_data = html_data_buy+html_data_2//+refund_user
    }

    
    $('#pendingTransaction').removeClass('removeEffect');
    $('#trans_details_pending').html(html_data);
    $('.shadow').removeClass('removeEffect');
    })
});

$('.succ_txn').click(function(){
    var date = this.querySelector("#timestamp").innerText;

    $.post("/exchange/get_order_info/", {
            order_id: this.id,
        }).done(function(data) {

    var html_data_buy = `

        <div class="pop-receipt-info">
            <div class="pop-receipt-keys">
                        
                <p>Category</p>
                <br>
                <p>Coin</p>
                <br>
                <p>Network</p>
                <br>
                <p>Address</p>
            </div>
            <div class="pop-receipt-values">
                <p>${data['category']}</p>
                <br>
                <p>${data['token']}</p>
                <br>
                <p>${data['network']}</p>
                <br>
                <p style="max-width: 150px;overflow-wrap: break-word;width: 100%;">${data['address']}</p>
            </div>
        </div>

        <div class="pop-receipt-info">
            <div class="pop-receipt-keys">
                        
                <p>Amount</p>
                <br>
                <p>Time stamp</p>
                <br>
                <p>Order ID</p>
            </div>
            <div class="pop-receipt-values">
                <p>${data['amount']}</p>
                <br>
                <p>${data['date']}</p>
                <br>
                <p id="txn_id" style="max-width: 150px;overflow-wrap: break-word;width: 100%;">${data['order_id']}</p>
            </div>
        </div>
    `

    var html_data_sell = `

        <div class="pop-receipt-info">
            <div class="pop-receipt-keys">
                        
                <p>Category</p>
                <br>
                <p>Coin</p>
                <br>
                <p>Bank name</p>
                <br>
                <p>Account number</p>
                <br>
                <p>Account name</p>
            </div>
            <div class="pop-receipt-values">
                <p>${data['category']}</p>
                <br>
                <p>${data['token']}</p>
                <br>
                <p>${data['Bank_name']}</p>
                <br>
                <p>${data['Account_number']}</p>
                <br>
                <p>${data['Account_name']}</p>
            </div>
        </div>

        <div class="pop-receipt-info">
            <div class="pop-receipt-keys">
                        
                <p>Amount</p>
                <br>
                <p>Time stamp</p>
                <br>
                <p>Order ID</p>
            </div>
            <div class="pop-receipt-values">
                <p>${data['amount']}</p>
                <br>
                <p>${data['date']}</p>
                <br>
                <p id="txn_id" style="max-width: 150px;overflow-wrap: break-word;width: 100%;">${data['order_id']}</p>
            </div>
        </div>
    `

    var html_data = ``
    var html_data_2 = `<span onclick="copy_order_id('${data['order_id']}')"><p style="text-align: center;font-size: 14px;margin: -30px 0 40px;font-family: Poppins;font-style: normal;font-weight: normal;line-height: 135%;color: #229de2;">Copy Order ID</p></span>`
    
    var report_trade = `<span onclick="showSupportChannels()"><p style="cursor: pointer; text-align: center;font-size: 14px;margin: -30px 0 40px;font-family: Poppins;font-style: normal;font-weight: normal;line-height: 135%;color: #EB5757;">Report Trade</p></span>`
    

    var contact_support = `<div class="contact-suport-div stayDown" id="contact-suport-div">
                            <h4>Please choose any of our contact channels</h4>
                            <div class="contact-suport-buttons">
                                <a href="https://wa.me/+2348117905123" target=”_blank” rel="noopener noreferrer"><div class="support-img whatsapp-support"></div></a>
                                <a href="https://t.me/{{site.name}}official" target=”_blank” rel="noopener noreferrer"><div class="support-img telegram-support"></div></a>
                            </div>
                        </div>`
    
    if (data['category'] == 'Sell') {

        html_data = html_data_sell+html_data_2+report_trade+contact_support

    } else {

        html_data = html_data_buy+html_data_2+report_trade+contact_support
    }


    $('#completeTransaction').removeClass('removeEffect');
    $('#trans_details_complete').html(html_data);
    $('.shadow').removeClass('removeEffect');
    })
});

$('.failed_txn').click(function(){
    var date = this.querySelector("#timestamp").innerText;

    $.post("/exchange/get_order_info/", {
            order_id: this.id,
        }).done(function(data) {


    var html_data_buy = `

        <div class="pop-receipt-info">
            <div class="pop-receipt-keys">
                        
                <p>Category</p>
                <br>
                <p>Coin</p>
                <br>
                <p>Network</p>
                <br>
                <p>Address</p>
            </div>
            <div class="pop-receipt-values">
                <p>${data['category']}</p>
                <br>
                <p>${data['token']}</p>
                <br>
                <p>${data['network']}</p>
                <br>
                <p style="max-width: 150px;overflow-wrap: break-word;width: 100%;">${data['address']}</p>
            </div>
        </div>

        <div class="pop-receipt-info">
            <div class="pop-receipt-keys">
                        
                <p>Amount</p>
                <br>
                <p>Time stamp</p>
                <br>
                <p>Order ID</p>
            </div>
            <div class="pop-receipt-values">
                <p>${data['amount']}</p>
                <br>
                <p>${data['date']}</p>
                <br>
                <p id="txn_id" style="max-width: 150px;overflow-wrap: break-word;width: 100%;">${data['order_id']}</p>
            </div>
        </div>
    `

    var html_data_sell = `

        <div class="pop-receipt-info">
            <div class="pop-receipt-keys">
                        
                <p>Category</p>
                <br>
                <p>Coin</p>
                <br>
                <p>Bank name</p>
                <br>
                <p>Account number</p>
                <br>
                <p>Account name</p>
            </div>
            <div class="pop-receipt-values">
                <p>${data['category']}</p>
                <br>
                <p>${data['token']}</p>
                <br>
                <p>${data['Bank_name']}</p>
                <br>
                <p>${data['Account_number']}</p>
                <br>
                <p>${data['Account_name']}</p>
            </div>
        </div>

        <div class="pop-receipt-info">
            <div class="pop-receipt-keys">
                        
                <p>Amount</p>
                <br>
                <p>Time stamp</p>
                <br>
                <p>Order ID</p>
            </div>
            <div class="pop-receipt-values">
                <p>${data['amount']}</p>
                <br>
                <p>${data['date']}</p>
                <br>
                <p id="txn_id" style="max-width: 150px;overflow-wrap: break-word;width: 100%;">${data['order_id']}</p>
            </div>
        </div>
    `

    var html_data = ``
    var html_data_2 = `<span onclick="copy_order_id('${data['order_id']}')"><p style="text-align: center;font-size: 14px;margin: -30px 0 40px;font-family: Poppins;font-style: normal;font-weight: normal;line-height: 135%;color: #229de2;">Copy Order ID</p></span>`
    var report_trade = `<span onclick="showSupportChannels()"><p style="cursor: pointer; text-align: center;font-size: 14px;margin: -30px 0 40px;font-family: Poppins;font-style: normal;font-weight: normal;line-height: 135%;color: #EB5757;">Report Trade</p></span>`
    

    var contact_support = `<div class="contact-suport-div stayDown" id="contact-suport-div">
                            <h4>Please choose any of our contact channels</h4>
                            <div class="contact-suport-buttons">
                                <a href="https://wa.me/+2348117905123" target=”_blank” rel="noopener noreferrer"><div class="support-img whatsapp-support"></div></a>
                                <a href="https://t.me/{{site.name}}official" target=”_blank” rel="noopener noreferrer"><div class="support-img telegram-support"></div></a>
                            </div>
                        </div>`
    if (data['category'] == 'Sell') {

        html_data = html_data_sell+html_data_2+report_trade+contact_support

    } else {

        html_data = html_data_buy+html_data_2+report_trade+contact_support
    }


    $('#fialedTransaction').removeClass('removeEffect');
    $('#trans_details_failed').html(html_data);
    $('.shadow').removeClass('removeEffect');

        })
});


const showSupportChannels =()=>{
    console.log("Clicked ME !!!!")
    $("#contact-suport-div").removeClass('stayDown')
}




function removeEffectCanceled(){
    $('#canceledTransaction').addClass('removeEffect');
    $('.shadow').addClass('removeEffect');

}


function removeEffectFailed(){
    $('#fialedTransaction').addClass('removeEffect');
    $('.shadow').addClass('removeEffect');

}



function removeEffectSucc(){
    $('#completeTransaction').addClass('removeEffect');
    $('.shadow').addClass('removeEffect');
}

function removeEffectpending(){
    $('#pendingTransaction').addClass('removeEffect');
    $('.shadow').addClass('removeEffect');
}

// $(element).attr('placeholder', placeholder text)


$('#close_canceled').click(function(){
    removeEffectCanceled();
});


$('#close_failed').click(function(){
    removeEffectFailed();
});


$('#close_complete').click(function(){
    removeEffectSucc();

});


$('#close_pending').click(function(){
    removeEffectpending();

});



$('.shadow').click(function(){
    removeEffectFailed();
    removeEffectSucc();
    removeEffectCanceled();
    removeEffectpending();
    $('#report_txn_form').css({'display': 'none'});
    $('#resolved_ticket_pop').css({'display': 'none'});
    $('#pending_ticket_pop').css({'display': 'none'});
});


$('#close_form').click(function(){
    $('.shadow').addClass('removeEffect');
    $('#report_txn_form').css({'display': 'none'});
    $('#resolved_ticket_pop').css({'display': 'none'});
    $('#pending_ticket_pop').css({'display': 'none'});
});


$('#id_close_form').click(function(){
    $('.shadow').addClass('removeEffect');
    $('#pending_ticket_pop').css({'display': 'none'});
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
$('#terms_and_conditions_agreement_btn').prop('disabled', true);
$('#terms_and_conditions_agreement_btn').removeClass('activate-btn')




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






$('.succ_ticket').click(function(){

   $.post("/exchange/get_ticket_info/", {
            ticket_id: this.id,
        }).done(function(data) {


    var html_data = `
    <div class="ticket-container">
        <div class="ticket-title">
            <h2>${data['subject']}</h2>
        </div>

        <div class="ticket-body">
            <p>${data['details']}</p>
        </div>

        <div class="separation-bar"></div>
        <div class="ticket-center-text" style="text-align:center;">
            <h3>Reply</h3>
        </div>
        <div class="separation-bar"></div>

        <div class="ticket-body">
            <p>
                ${data['reply']}
            </p>
        </div>
    </div>
    `

    $('#succ_ticket_div').html(html_data);
     $('#resolved_ticket_pop').css({'display': 'block'});
     $('.shadow').removeClass('removeEffect');
    })
});



$('.pending_ticket').click(function(){

   $.post("/exchange/get_ticket_info/", {
            ticket_id: this.id,
        }).done(function(data) {


    var html_data = `
    <div class="ticket-container">
        <div class="ticket-title">
            <h2>${data['subject']}</h2>
        </div>

        <div class="ticket-body">
            <p>${data['details']}</p>
        </div>
    </div>
    `

    $('#pending_ticket_div').html(html_data);
     $('#pending_ticket_pop').css({'display': 'block'});
     $('.shadow').removeClass('removeEffect');
    })
});