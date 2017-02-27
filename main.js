$(function () {

    var addlinebutton = $('#AddLineItem');
    var deletelinebutton = $('.delete-item');
    var saveInvoice = $('#saveInvoice');
    var preview = $('#previewInvoice');

    //datepicker
    $( "#invoicedate" ).datepicker();
    $( "#duedate" ).datepicker();

    var rightbox = $(".right-box");
    var h = rightbox.offset().top;

    $(window).on("scroll", function(e) {
        if ($(window).scrollTop() > h + 35) {
            rightbox.addClass("fixed");
        } else {
            rightbox.removeClass("fixed");
        }

    });


    var idCount = 0;

    var storedItems = JSON.parse(localStorage.getItem('griditems'));

    if(storedItems) {
        for(var i = 0; i < storedItems.length; i++) {
            idCount++;
            var itemid = storedItems[i].id;
            var itemhtml = storedItems[i].value;
            $('.grid').append(itemhtml);
        }
    }

    $('input').each(function(){
        var id = $(this).attr('id');
        var value = localStorage.getItem(id);
        if($(this).is('[readonly]')) {

        } else {
            $(this).val(value);
        }
    });

    $('select').find(":selected").each(function () {
        var id = $(this).parent().attr('id');
        var value = localStorage.getItem(id);
        $(this).parent().val(value);
    });

    saveInvoice.on('click', function () {
        $('input').each(function () {
            var id = $(this).attr('id');
            var value = $(this).val();
            localStorage.setItem(id, value);
        });
        $('select').find(":selected").each(function () {
            var id = $(this).parent().attr('id');
            var value = $(this).val();
            localStorage.setItem(id, value);
        });
        var griditems = [];
        var invoiceitems =[];
        $('.grid .grid-item').each(function () {
            var id = $(this).attr('id');
            var eachitem = {
                id: id,
                value: $(this).wrap('<p/>').parent().html()
            };
            griditems.push(eachitem);
        })
        localStorage.setItem('griditems', JSON.stringify(griditems));
        $('.grid-item').unwrap();
    });



    var newitem = `<div class="row grid-item" id="griditem">
                   <div class="col-md-6">
                   <input type="text" class="form-control grid-input item-desc" placeholder="Enter Item Description" id="item"></div>
                    <div class="col-md-2">
                        <input type="number" min="0" class="form-control grid-input item-qty" id="qty">
                    </div>
                    <div class="col-md-2">
                        <input type="number" min="0" class="form-control grid-input item-price" id="price">
                    </div>
                    <div class="col-md-2">
                        <span class="item-amount">$0.00</span>
                    </div>
                    <div class="delete-item">
                        <i class="fa fa-trash-o" aria-hidden="true"></i>
                    </div>
                    </div>`;


    if($('.grid').children().length == 0) {
        $('.grid').append(newitem);
    }



    addlinebutton.click(function () {
        idCount++;
        var newitem = `<div class="row grid-item" id="griditem${idCount}">
                   <div class="col-md-6">
                   <input type="text" class="form-control grid-input item-desc" placeholder="Enter Item Description" id="item${idCount}"></div>
                    <div class="col-md-2">
                        <input type="number" min="0" class="form-control grid-input item-qty" id="qty${idCount}">
                    </div>
                    <div class="col-md-2">
                        <input type="number" min="0" class="form-control grid-input item-price" id="price${idCount}">
                    </div>
                    <div class="col-md-2">
                        <span class="item-amount">$0.00</span>
                    </div>
                    <div class="delete-item">
                        <i class="fa fa-trash-o" aria-hidden="true"></i>
                    </div>
                    </div>`;

        // var invoiceitem = `<div class="row" id="invoiceitem${idCount}">
        //            <div class="col-md-6">
        //            <p id="invoiceitem${idCount}"></p></div>
        //             <div class="col-md-2">
        //                 <p id="invoiceqty${idCount}"></p>
        //             </div>
        //             <div class="col-md-2">
        //                 <p id="invoiceprice${idCount}"></p>
        //             </div>
        //             <div class="col-md-2">
        //                 <span class="invoice-item-amount"></span>
        //             </div>
        //             </div>`;
        $('.grid').append(newitem);
    });

    var currentTax = $('#currenttax').text();

    $('#customtax').val(currentTax);

    function getbill() {
        var subtotal = 0;
        $('.item-amount').each(function () {
            subtotal += parseFloat($(this).text().replace("$", ""));
        });

        $('.subtotal').text('$' + subtotal.toFixed(2));

        var currentTax = $('#currenttax').text();

        var subtotalValue = parseFloat($('.subtotal').text().replace("$", ""));
        var tax = parseFloat(subtotalValue * (currentTax/100)).toFixed(2);
        $('.tax').text('$' + tax);

        var grandtotal = parseFloat(tax) + parseFloat(subtotal);

        $('.total').text('$' + grandtotal.toFixed(2));

    }

    getbill();

    function showitems() {
        $('.grid .grid-item').each(function () {
            var invoicedesc = $(this).find('.item-desc').val();
            var invoiceqty = $(this).find('.item-qty').val();
            var invoiceprice = $(this).find('.item-price').val();

            var invoiceitem = `<div class="row">
                       <div class="col-md-6">
                       <p>${invoicedesc}</p></div>
                        <div class="col-md-2">
                            <p>${invoiceqty}</p>
                        </div>
                        <div class="col-md-2">
                            <p>${invoiceprice}</p>
                        </div>
                        <div class="col-md-2">
                            <span class="invoice-item-amount"></span>
                        </div>
                        </div>`;

            $('.invoiceitems').append(invoiceitem);
        })
    }

    showitems();

    $(document).on('keyup change', function () {
       getbill();
       showitems();
    });

    $(document).on('mouseenter', '.grid-item', function()
    {
        if($('.grid-item').length === 1) {
            $(this).find('.delete-item').hide();
        } else {
            $(this).find('.delete-item').show();
        }

    }).on('mouseleave', '.grid-item', function () {
        $(this).find('.delete-item').hide();
    });


    $('#customtax').on('keyup change', function () {
        if($(this).val().length == 0) {
            $('#currenttax').text('0');
        } else {
            $('#currenttax').text($(this).val());
        }
    });

    $('#customtax').hide();

    $('.change-tax').on('click', function () {
        $('#customtax').toggle();
        $(this).toggleClass('fa-pencil fa-times')
    });

    var count = 0;

    $(document).on('click', '.delete-item', function () {
        $(this).parent('.grid-item').remove();
        $('.grid-item').each(function () {
            count++;
            $(this).attr('id', `griditem${count}`);
            $(this).find('.grid-input').attr('id', `item${count}`);
            $(this).find('.item-qty').attr('id', `qty${count}`);
            $(this).find('.item-price').attr('id', `price${count}`);
        });
        getbill();
    });

    $(document).on('keyup change', '.item-qty', function () {

        var itemprice = parseFloat($(this).parent().siblings('div').find('.item-price').val()).toFixed(2);
        var itemqty = parseFloat($(this).val()).toFixed(2);

        if(isNaN(itemprice)) {
            itemprice = 0;
        } else {
            itemprice = parseFloat($(this).parent().siblings('div').find('.item-price').val()).toFixed(2);
        }

        if(isNaN(itemqty)) {
            itemqty = 0;
        } else {
            itemqty = parseFloat($(this).val()).toFixed(2);
        }

        console.log(itemqty);
        console.log(itemprice);

        var amount = Math.round((itemprice * itemqty + 0.00001) * 100) / 100;
        $(this).parent('div').siblings('div').find('.item-amount').text('$' + amount.toFixed(2));
    });

    $(document).on('keyup change', '.item-price', function () {

        var itemprice = parseFloat($(this).val()).toFixed(2);
        var itemqty = parseFloat($(this).parent().siblings('div').find('.item-qty').val()).toFixed(2);

        if(isNaN(itemprice)) {
            itemprice = 0;
        } else {
            itemprice = parseFloat($(this).val()).toFixed(2);
        }

        if(isNaN(itemqty)) {
            itemqty = 0;
        } else {
            itemqty = parseFloat($(this).parent().siblings('div').find('.item-qty').val()).toFixed(2);
        }

        console.log(itemqty);
        console.log(itemprice);

        var amount = Math.round((itemprice * itemqty + 0.00001) * 100) / 100;
        $(this).parent('div').siblings('div').find('.item-amount').text('$' + amount.toFixed(2));
    });

    var companyName = $('#companyname').val();
    var companyAddress = $('#companyaddress').val();
    var companyCity = $('#companycity').val();
    var companyPostal = $('#companypostal').val();
    var companyProvince = $('#companypostal').find(":selected").text();
    var companyNumber = $('#companynumber').val();
    var companyEmail = $('#companyemail').val();

    var customerName = $('#customername').val();
    var customerEmail = $('#customeremail').val();
    var customerAddress = $('#customeraddress').val();
    var customerCity = $('#customercity').val();
    var customerProvince = $('#customerprovince').find(":selected").text();
    var customerPostal = $('#customerpostal').val();

    var invoiceNumber = $('#invoicenumber').val();
    var invoiceDate = $('#invoicedate').val();
    var invoiceDuedate = $('#duedate').val();

    $('.invoice-overlay').on('click', function () {
        $(this).fadeOut();
        $('.invoice-view').fadeOut();
    });

    $('.invoice-exit').on('click', function () {
        $('.invoice-view').fadeOut();
        $('.invoice-overlay').fadeOut();
    });

    preview.on('click', function () {
        $('.invoice-view').fadeIn();
        $('.invoice-overlay').fadeIn();
    });


    $('input').on('keyup', function () {
        //inputs
        var companyName = $('#companyname').val();
        var companyAddress = $('#companyaddress').val();
        var companyCity = $('#companycity').val();
        var companyPostal = $('#companypostal').val();
        var companyProvince = $('#companypostal').val();
        var companyNumber = $('#companynumber').val();
        var companyEmail = $('#companyemail').val();

        var customerName = $('#customername').val();
        var customerEmail = $('#customeremail').val();
        var customerAddress = $('#customeraddress').val();
        var customerCity = $('#customercity').val();
        var customerProvince = $('#customerprovince').val();
        var customerPostal = $('#customerpostal').val();

        var invoiceNumber = $('#invoicenumber').val();
        var invoiceDate = $('#invoicedate').val();
        var invoiceDuedate = $('#duedate').val();

    });


    $('#showcompanyname').html(companyName);
    $('#showcompanyaddress').html(companyAddress);
    $('#showcompanycity').html(companyCity);
    $('#showinvoicenumber').html(invoiceNumber);
});