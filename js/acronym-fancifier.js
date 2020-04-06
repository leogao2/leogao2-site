// transforms acronyms to have small caps.

acronyms = {
    'GPT2': 'Generative Pretrained Transformer 2',
    'GPT': 'Generative Pretrained Transformer / GUID Partition Table',
    'RNN': 'Recurrent Neural Network',
    'LSTM': 'Long-Short Term Memory',
    'ODE': 'Ordinary Differential Equation',
    'CNN': 'Convolutional Neural Network',
    'ReLU': 'Rectified Linear Unit',
    'MLP': 'Multilayer Perceptron',
    'ELU': 'Exponential Linear Unit',
    'SELU': 'Scaled Exponential Linear Unit',
    'GELU': 'Gaussian Exponential Linear Unit',
    'BERT': 'Bidirectional Encoder Representations from Transformers',
    'CDF': 'Cumulative Distribution Function',
    'GPU': 'Graphics Processing Unit',
}

// from https://stackoverflow.com/questions/3561493/is-there-a-regexp-escape-function-in-javascript
function regExpEscape(literal_string) {
    return literal_string.replace(/[-[\]{}()*+!<=:?.\/\\^$|#\s,]/g, '\\$&');
}
let acronym_match = new RegExp('\\b(' + Object.keys(acronyms).join('|') + ')(s?)', 'g')

// from https://www.reddit.com/r/javascript/comments/6a6lo7/how_can_i_check_if_a_character_is_lower_case_or/ 
function isLower(character) {
    return (character === character.toLowerCase()) && (character !== character.toUpperCase());
}

function replaceAcronyms(elem) {
    //console.log('ENTER')
    let newhtml = ''

    for (let i in elem.childNodes) {
        let child = elem.childNodes[i]
        if (child.nodeType == 3) {
            newh = child.textContent.replace(acronym_match, (match, p1, p2, offset, string) => {
                // '<span class="acronym acronym-$1">$1</span>$2'
                return `<span class="acronym acronym-${p1}">` + p1.split('').map((c) => isLower(c) ? ('<span class="acronymlower">' + c + '</span>') : c).join('') + '</span>' + p2
            })
            //console.log(child.nodeType, child, newh)
            newhtml += newh
            
        } else if (child.nodeType == 1) {
            replaceAcronyms(child)
            newhtml += child.outerHTML
            //console.log('dsffdsfdsdsf', child.outerHTML)
        } else {
            //console.log('ntype', child.nodeType, child.outerHTML)
            //newhtml += child.outerHTML
        }
        //console.log('newhtml', newhtml)
    }
    elem.innerHTML = newhtml
    //console.log('EXIT')
}

$(() => {
    console.log(acronym_match)
    replaceAcronyms(document.querySelector(".article-entry"))
    
    for (const [key, value] of Object.entries(acronyms)) {
        console.log(key)
        tippy('.acronym-'+key, {
            content: value,
          });
    }
})
