
let adjfnpos = [0]

$(window).on("load", function() {
    console.log('footnotes start')
    var leftax = $('.leftfnbegin').offset().top
    var rightax = $('.rightfnbegin').offset().top
    var leftmore = 0;
    $('.footnotes-list').children().each(function(ind, ob) {
        let i = ind + 1
        console.log(i)
        let offs = $(`#fnref${i}`).offset()
        // so that if 2 fns are too close theyll get separated
        let adjustedoffs = Math.max(offs.top, adjfnpos[adjfnpos.length - 1] + 50)
        adjfnpos.push(adjustedoffs)
        let toppos = offs.top - 70
        console.log(toppos)
        //$(`#footnote-${i}`).css('top', `${toppos}px`)

        if ((toppos < 900 || offs.left < window.innerWidth / 2 || (rightax - toppos > 200) || leftmore < -2) && !(leftax - toppos > 200)) {
            let newhtml = `<div class="floating-footnote" id="footnote-${i}" style="top: ${Math.max(leftax, toppos)}px"><span class="footnote-float-numeral">${i}</span> ${ob.innerHTML}</div>`
            $('.sidebar-left').append(newhtml)
            leftax = toppos + $(`#footnote-${i}`).outerHeight() + 30
            leftmore++
        } else {
            let newhtml = `<div class="floating-footnote" id="footnote-${i}" style="top: ${Math.max(rightax, toppos)}px"><span class="footnote-float-numeral">${i}</span> ${ob.innerHTML}</div>`
            $('.sidebar-right').append(newhtml)
            rightax = toppos + $(`#footnote-${i}`).outerHeight() + 30
            leftmore--
        }
    })
    
})

$(window).on("load resize", function() {
    console.log('resize', window.innerWidth)
    if (window.innerWidth < 1295) {
        $(".floating-footnote").css('display', 'none')
    } else {
        $(".floating-footnote").css('display', 'inline')
    }
});


// mobile time!

let referenceh = $(window).height() * 0.2;

// from https://stackoverflow.com/questions/9333379/check-if-an-elements-content-is-overflowing/34299947
function isOverflown(element) {
    return element.scrollHeight > element.clientHeight || element.scrollWidth > element.clientWidth;
}

var wasbestpos = false;

$(window).on("scroll", function() {
    if (window.innerWidth < 1295) {
        let bestdist = Infinity;
        var bestpos;

        let topthresh = $(window).scrollTop() + referenceh;
        let bottomthresh = $(window).scrollTop() + $(window).height() * 0.6;

        // naive O(n) algo; once i start having articles with thousands of footnotes I'll rewrite it
        for (let i = 1; i <= adjfnpos.length; i++) {
            //console.log($(window).scrollTop())
            let dist = Math.abs(($(window).scrollTop() + referenceh) - adjfnpos[i])
            //console.log(adjfnpos)
            if (bestdist < dist) {
                // done
                if (adjfnpos[bestpos] < $(window).scrollTop() || adjfnpos[bestpos] > bottomthresh) {
                    if (adjfnpos[i] < $(window).scrollTop() || adjfnpos[i] > bottomthresh) {
                        bestpos = null
                    } else {
                        bestpos = i
                    }
                }
                break
            }
            bestdist = Math.min(bestdist, dist)
            bestpos = i
        }

        if (bestpos > adjfnpos.length || adjfnpos[bestpos] < $(window).scrollTop()) bestpos = null

        console.log('mobilefn:', bestpos)
        if (bestpos) {
            if (wasbestpos) return
            wasbestpos = true;
            // overflow ellipsis
            if (isOverflown($('.mobile-fn-float')[0])) {
                $('.footnote-float-overflow').css('display', 'inline')
            } else {
                console.log('not overflow')
                $('.footnote-float-overflow').css('display', 'none')
            }

            $('.mobile-fn-float').css('opacity', '1')
            $('.footnote-float-numeral').html(bestpos)
            $('.footnote-float-content').html($(`.footnotes-list #fn${bestpos}`).html())
        } else {
            if (!wasbestpos) return
            wasbestpos = false;
            $('.mobile-fn-float').css('opacity', '0')
            $('.footnote-float-overflow').css('display', 'none')
            setTimeout(function() {
                $('.mobile-fn-float')[0].scrollTop = 0;
                $('.mobile-fn-float').css('overflow', 'hidden')
                console.log('not overflow 2')

            }, 300)
        }
    }
})

$('.footnote-float-overflow').click('click', function() {
    $('.footnote-float-overflow').css('display', 'none')
    $('.mobile-fn-float').css('overflow', 'scroll')
})