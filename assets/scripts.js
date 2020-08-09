$(function () {
    (function () {

        var handle = $(".js-slider-handle"),
            text = $(".js-slider-text");

        $( ".js-slider" ).slider({
            range: "min",
            value: 18,
            min: 18,
            max: 80,
            create: function() {
                text.text( $(this).slider( "value" ) );
            },
            slide: function( event, ui ) {
                App.calc.tarif = Math.max(0, parseInt(ui.value) - 18);
                text.text( ui.value );
            }
        });

    })();
});