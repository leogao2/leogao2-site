// transforms acronyms to have small caps.

acronyms = {
    'GPT-2': 'Generative Pretrained Transformer 2',
    'GPT-3': 'Generative Pretrained Transformer 3',
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
    'EDF': 'Empirical Distribution Function',
    'GPU': 'Graphics Processing Unit',
    'ILSVRC': 'ImageNet Large Scale Visual Recognition Challenge',
    'NLP': 'Natural Language Processing',
    'GAN': 'Generative Adversarial Network',
    'RMSProp': 'Root Mean Square Propagation',
    'SOTA': 'State of the Art',
    'GRU': 'Gated Recurrent Unit',
    'NAS': 'Neural Architecture Search',
    'ELMo': 'Embeddings from Language Models',
    'LM': 'Language Model',
    'TF': 'Tensorflow',
    'DQN': 'Deep Q Network',
    'HDF5': 'Hierarchical Data Format 5',
    '(?:117|124|345|355|774|1542)M': '',
    'NIPS': 'Neural Information Processing Systems',
    'NeurIPS': 'Neural Information Processing Systems',
    'ML': 'Machine Learning',
    'RL': 'Reinforcement Learning',
    'AI': 'Artifical Intelligence',
    'ISO': 'International Organization for Standardization',
    'XLNet': '',
    'L2ARC': 'Level 2 Adjustable Replacement Cache',
    'SSD': 'Solid State Drive',
    'ZFS': '',
    'MDADM': '',
    'RAM': 'Random Access Memory',
    'VRAM': 'Video Random Access Memory',
    'LVM': 'Logical Volume Management',
    'RAID': 'Redundant Array of Independent Disks',
    'ICLR': 'International Conference on Learning Representations',
    'AIXI': '',
    'IID': '',
    'TDP': '',
    'CTRL': '',
    'BPE': 'Byte-Pair Encoding',
    'PTB': 'Penn Tree Bank',
    'AGI': 'Artificial General Intelligence',
}

// from https://stackoverflow.com/questions/3561493/is-there-a-regexp-escape-function-in-javascript
function regExpEscape(literal_string) {
    return literal_string.replace(/[-[\]{}()*+!<=:?.\/\\^$|#\s,]/g, '\\$&');
}
let acronym_match = new RegExp('\\b(' + Object.keys(acronyms).filter(s=>s).sort((a,b)=>b.length-a.length).join('|') + ')(s?)', 'g')
console.log(acronym_match)
// from https://www.reddit.com/r/javascript/comments/6a6lo7/how_can_i_check_if_a_character_is_lower_case_or/ 
function isLower(character) {
    return (character === character.toLowerCase()) && (character !== character.toUpperCase());
}
function isUpper(character) {
    return (character !== character.toLowerCase()) && (character === character.toUpperCase());
}

function getsSmallCaps(word) {
    return (word.split('').filter(isUpper).length) > 2;
}

function replaceAcronyms(elem) {
    //console.log('ENTER')
    let newhtml = ''

    for (let i in elem.childNodes) {
        let child = elem.childNodes[i]
        if (child.nodeType == 3) {
            newh = child.textContent.replace(acronym_match, (match, p1, p2, offset, string) => {
                // '<span class="acronym acronym-$1">$1</span>$2'
                let is_starter = offset == 0 && i == 0 && (elem.tagName != 'STRONG' && elem.tagName != 'EM' && elem.tagName != 'A' || elem.previousSibling && elem.previousSibling.textContent.trim().slice(-1) == '.') || string[offset - 2] == '.'
                let chaarr = p1.split('').map((c) => isLower(c) ? ('<span class="acronymlower">' + c + '</span>') : c)
                return `<span class="${getsSmallCaps(p1) ? 'acronym' : ''} acronym-${p1}">${is_starter ? '<span class="acronym-first">' + chaarr[0] + '</span>' : ''}` + (is_starter ? chaarr.slice(1) : chaarr).join('') + '</span>' + p2
            })
            //console.log(child.nodeType, child, newh)
            newhtml += newh
            
        } else if (child.nodeType == 1) {
            if (child.tagName != 'H1' && child.tagName != 'H2' && child.tagName != 'H3') replaceAcronyms(child)
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
        if (value == '') continue
        console.log(key)
        tippy('.acronym-'+key, {
            content: value,
          });
    }
})
