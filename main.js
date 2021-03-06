$(function () {

    var addlinebutton = $('#AddLineItem');
    var deletelinebutton = $('.delete-item');
    var saveInvoice = $('#saveInvoice');
    var preview = $('#previewInvoice');

    $( "#invoicedate" ).datepicker();
    $( "#duedate" ).datepicker();

    var rightbox = $(".right-box");
    var h = rightbox.offset().top;

    $(window).on("scroll", function(e) {
        if ($(window).scrollTop() > h + 45) {
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
                   <div class="col-sm-6 col-md-6">
                   <input type="text" class="form-control grid-input item-desc" placeholder="Enter Item Description" id="item"></div>
                    <div class="col-sm-2 col-md-2">
                        <input type="number" min="0" class="form-control grid-input item-qty" id="qty">
                    </div>
                    <div class="col-sm-2 col-md-2">
                        <input type="number" min="0" class="form-control grid-input item-price" id="price">
                    </div>
                    <div class="col-sm-2 col-md-2">
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
                   <div class="col-sm-6 col-md-6">
                   <input type="text" class="form-control grid-input item-desc" placeholder="Enter Item Description" id="item${idCount}"></div>
                    <div class="col-sm-2 col-md-2">
                        <input type="number" min="0" class="form-control grid-input item-qty" id="qty${idCount}">
                    </div>
                    <div class="col-sm-2 col-md-2">
                        <input type="number" min="0" class="form-control grid-input item-price" id="price${idCount}">
                    </div>
                    <div class="col-sm-2 col-md-2">
                        <span class="item-amount">$0.00</span>
                    </div>
                    <div class="delete-item">
                        <i class="fa fa-trash-o" aria-hidden="true"></i>
                    </div>
                    </div>`;

        $('.grid').append(newitem);
    });

    var customTax = $('#customtax').val();

    if(customTax == '') {
        $('#currenttax').text('0');
        $('#showcurrenttax').text('0');
    } else {
        $('#currenttax').text(customTax);
    }


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
            var invoiceamount = $(this).find('.item-amount').text();

            var invoiceitem = `<div class="row">
                       <div class="col-sm-6 col-md-6">
                       <p>${invoicedesc}</p></div>
                        <div class="col-sm-2 col-md-2">
                            <p>${invoiceqty}</p>
                        </div>
                        <div class="col-sm-2 col-md-2">
                            <p>${invoiceprice}</p>
                        </div>
                        <div class="col-sm-2 col-md-2">
                            <span class="invoice-item-amount">${invoiceamount}</span>
                        </div>
                        </div>`;

            $('.invoiceitems').append(invoiceitem);
        })


    }

    function clearitems() {
        $('.invoiceitems').html('');
    }

    $(document).on('keyup change', function () {
       getbill();
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
            $('#showcurrenttax').text($(this).val());
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

        var amount = Math.round((itemprice * itemqty + 0.00001) * 100) / 100;
        $(this).parent('div').siblings('div').find('.item-amount').text('$' + amount.toFixed(2));
    });

    var companyName = $('#companyname').val();
    var companyAddress = $('#companyaddress').val();
    var companyCity = $('#companycity').val();
    var companyPostal = $('#companypostal').val();
    var companyProvince = $('#companyprovince').val();

    var customerName = $('#customername').val();
    var customerAddress = $('#customeraddress').val();
    var customerCity = $('#customercity').val();
    var customerProvince = $('#customerprovince').val();
    var customerPostal = $('#customerpostal').val();

    var customTax = $('#customtax').val();

    var invoiceNumber = $('#invoicenumber').val();
    var invoiceDate = $('#invoicedate').val();
    var invoiceDuedate = $('#duedate').val();

    $('.invoice-exit').on('click', function () {
        $('.invoice-view').fadeOut();
        clearitems();
    });

    $(".invoice-view").click(function(){
        $(this).fadeOut();
        clearitems();
    }).find('.invoice-paper').click(function(e) {
        return false;
    });

    preview.on('click', function () {
        $('.invoice-view').fadeIn();
        showitems();
    });


    $('input').on('keyup change', function () {
        //inputs

        if($(this).val().length === 0) {

        }
        var companyName = $('#companyname').val();
        var companyAddress = $('#companyaddress').val();
        var companyCity = $('#companycity').val();
        var companyPostal = $('#companypostal').val();
        var companyProvince = $('#companyprovince').val();

        var customerName = $('#customername').val();
        var customerAddress = $('#customeraddress').val();
        var customerCity = $('#customercity').val();
        var customerProvince = $('#customerprovince').val();
        var customerPostal = $('#customerpostal').val();

        var invoiceNumber = $('#invoicenumber').val();
        var invoiceDate = $('#invoicedate').val();
        var invoiceDuedate = $('#duedate').val();

        var customTax = $('#customtax').val();
    });

    $('#showcompanyname').html(companyName);
    $('#showcompanyaddress').html(companyAddress);
    $('#showcompanycity').html(companyCity + ',');
    $('#showcompanyprovince').html(companyProvince);

    $('#showcustomername').html(customerName);
    $('#showcustomeraddress').html(customerAddress);
    $('#showcustomercity').html(customerCity + ',');
    $('#showcustomerprovince').html(customerProvince);

    $('#showcurrenttax').html(customTax);

    $('#showinvoicenumber').html(invoiceNumber);
    $('#showinvoicedate').html(invoiceDate);
    $('#showduedate').html(invoiceDuedate);
});