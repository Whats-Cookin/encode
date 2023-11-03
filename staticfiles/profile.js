function get_verification_form(){
    if ($("#verification_method :selected").text() == "Select your verification method") {
        $('.User-verification').addClass('hide_verification_details');
        $("#id_bvn").prop('required', false);
        $("#id_nin").prop('required', false);
        $("#id_profile_image").prop('required', false);
    }
    else{


    if ($("#verification_method :selected").text() == "National Identification Number") {
        console.log($("#verification_method :selected").text());
        $('.User-verification').removeClass('hide_verification_details');
        $('#my_bvn').hide();
        $('#my_nin').show();
        $("#id_nin").prop('required', true);
        $("#id_profile_image").prop('required', true);

    }else if($("#verification_method :selected").text() == "Bank Verification Number"){
         console.log($("#verification_method :selected").text());
          $('.User-verification').removeClass('hide_verification_details');
           $('#my_bvn').show();
           $('#my_nin').hide();
           $("#id_bvn").prop('required', true);
           $("#id_profile_image").prop('required', true);
    }
    else{
        //pass
    }

}

}



if ($("#verification_method :selected").text() == "Select your verification method") {
        $('.User-verification').addClass('hide_verification_details');
        $("#id_bvn").prop('required', false);
        $("#id_nin").prop('required', false);
        $("#id_profile_image").prop('required', false);
    }
    else{


    if ($("#verification_method :selected").text() == "National Identification Number") {
        console.log($("#verification_method :selected").text());
        $('.User-verification').removeClass('hide_verification_details');
        $('#my_bvn').hide();
        $('#my_nin').show();
        $("#id_nin").prop('required', true);
        $("#id_profile_image").prop('required', true);

    }else if($("#verification_method :selected").text() == "Bank Verification Number"){
         console.log($("#verification_method :selected").text());
          $('.User-verification').removeClass('hide_verification_details');
           $('#my_bvn').show();
           $('#my_nin').hide();
           $("#id_bvn").prop('required', true);
           $("#id_profile_image").prop('required', true);
    }
    else{
        //pass
    }

}