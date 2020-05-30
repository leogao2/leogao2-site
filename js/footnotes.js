
let adjfnpos = [0]

function setup_footnotes() {
    //console.log('footnotes start')
    var leftax = $('.leftfnbegin').offset().top
    var rightax = $('.rightfnbegin').offset().top
    var leftmore = 0;
    $('.sidebar-left-footnotes').html('')
    $('.sidebar-right-footnotes').html('')
    $('.footnotes-list').children().each(function(ind, ob) {
        let i = ind + 1
        //console.log(i)
        let offs = $(`#fnref${i}`).offset()
        $(`#fnref${i}`).hover(function() {
            console.log(i, 'hover on')
            $(`#footnote-${i}`).css("box-shadow", "2px 4px 6px #bbb")
            $(`#fnref${i}`).css("box-shadow", "1px 2px 3px #bbb")
            //$(`#fnref${i}`).css("border", "1px solid #ccc")
        }, function() {
            console.log(i, 'hover off')
            $(`#footnote-${i}`).css("box-shadow", "1px 2px 3px #ddd")
            $(`#fnref${i}`).css("box-shadow", "none")
            $(`#fnref${i}`).css("border", "none")
        })
        // so that if 2 fns are too close theyll get separated
        let adjustedoffs = Math.max(offs.top, adjfnpos[adjfnpos.length - 1] + 50)
        adjfnpos.push(adjustedoffs)
        let toppos = offs.top - 70
        //console.log(toppos)
        //$(`#footnote-${i}`).css('top', `${toppos}px`)

        if ((toppos < 900 || offs.left < window.innerWidth / 2 || (rightax - toppos > 200) || leftmore < -2) && !(leftax - toppos > 200) && (leftmore <= 2)) {
            //console.log(toppos, rightax)
            let newhtml = `<div class="floating-footnote" id="footnote-${i}" style="top: ${Math.max(leftax, toppos)}px"><span class="footnote-float-numeral">${i}</span> ${ob.innerHTML}</div>`
            $('.sidebar-left-footnotes').append(newhtml)
            leftax = toppos + $(`#footnote-${i}`).outerHeight() + 30
            leftmore++
        } else {
            let newhtml = `<div class="floating-footnote" id="footnote-${i}" style="top: ${Math.max(rightax, toppos)}px"><span class="footnote-float-numeral">${i}</span> ${ob.innerHTML}</div>`
            $('.sidebar-right-footnotes').append(newhtml)
            rightax = toppos + $(`#footnote-${i}`).outerHeight() + 30
            leftmore--
        }

        $(`#footnote-${i}`).hover(function() {
            console.log(i, 'hover on')
            $(`#footnote-${i}`).css("box-shadow", "2px 4px 6px #bbb")
            $(`#fnref${i}`).css("box-shadow", "1px 2px 3px #bbb")
            //$(`#fnref${i}`).css("border", "1px solid #ccc")
        }, function() {
            console.log(i, 'hover off')
            $(`#footnote-${i}`).css("box-shadow", "1px 2px 3px #ddd")
            $(`#fnref${i}`).css("box-shadow", "none")
            $(`#fnref${i}`).css("border", "none")

        })
    })
    
}

$(window).on("load", setup_footnotes)

var ft_setup_scheduled = false

$(window).on("load resize", function() {
    //console.log('resize', window.innerWidth)
    if (window.innerWidth < 1295) {
        $(".floating-footnote").css('display', 'none')
        $('.mobile-fn-float-wrapper').css('display', 'inline')
    } else {
        $(".floating-footnote").css('display', 'inline')
        $('.mobile-fn-float-wrapper').css('display', 'none')
        if (!ft_setup_scheduled) {
            // ugly bodge but it works
            setTimeout(function() {
                setup_footnotes();
                ft_setup_scheduled = false
            }, 200)
        }
        ft_setup_scheduled = true
    }
});


// mobile time!

let referenceh = $(window).height() * 0.2;

// from https://stackoverflow.com/questions/9333379/check-if-an-elements-content-is-overflowing/34299947
function isOverflown(element) {
    return element.scrollHeight > element.clientHeight || element.scrollWidth > element.clientWidth;
}

var wasbestpos = null;

$(window).on("scroll", function() {
    if (window.innerWidth < 1295) {
        let bestdist = Infinity;
        var bestpos = null;

        let topthresh = $(window).scrollTop() + referenceh;
        let bottomthresh = $(window).scrollTop() + $(window).height() * 0.6;
        console.log(adjfnpos)

        // naive O(n) algo; once i start having articles with thousands of footnotes I'll rewrite it
        for (let i = 1; i < adjfnpos.length; i++) {
            //console.log($(window).scrollTop())
            let dist = Math.abs(($(window).scrollTop() + referenceh) - adjfnpos[i])
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
            if (wasbestpos === bestpos) return
            wasbestpos = bestpos;
            // overflow ellipsis

            $(".mobile-fn-float-wrapper").css('display', 'inline')
            setTimeout(function() {
                $('.mobile-fn-float').css('opacity', '1')
                $('.footnote-float-numeral-mobile').html(bestpos)
                $('.footnote-float-content').html($(`.footnotes-list #fn${bestpos}`).html())

                if (isOverflown($('.mobile-fn-float')[0])) {
                    $('.footnote-float-overflow').css('display', 'inline')
                } else {
                    console.log('not overflow')
                    $('.footnote-float-overflow').css('display', 'none')
                }
            }, 100)
        } else {
            if (wasbestpos === false) return
            wasbestpos = false;
            $('.mobile-fn-float').css('opacity', '0')
            $('.footnote-float-overflow').css('display', 'none')
            setTimeout(function() {
                $('.mobile-fn-float')[0].scrollTop = 0;
                $('.mobile-fn-float').css('overflow', 'hidden')
                //console.log('not overflow 2')
                $('.mobile-fn-float-wrapper').css('display', 'none')

            }, 300)
        }
    }
})

$('.footnote-float-overflow').click('click', function() {
    $('.footnote-float-overflow').css('display', 'none')
    $('.mobile-fn-float').css('overflow', 'scroll')
})