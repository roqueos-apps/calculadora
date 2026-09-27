// O motor da Calculadora: a expressão vira fichas, as fichas viram notação polonesa reversa
// (shunting-yard) e a notação vira número. Funções puras, com graus ou radianos passados como
// argumento, para o teste não precisar montar a tela e a reatividade não entrar na conta.
//
// Os operadores são os que a tela desenha: − (menos), × e ÷, não os do teclado ASCII. Quem
// traduz o teclado físico para eles é o componente.

const PREC = { '+': 2, '−': 2, '×': 3, '÷': 3, '^': 4 }
const RIGHT = { '^': true }
const NEG_PREC = 3.5

export function tokenize(s) {
  const tk = []
  let i = 0
  const isD = (c) => c >= '0' && c <= '9'
  while (i < s.length) {
    const c = s[i]
    if (c === ' ') {
      i++
      continue
    }
    if (isD(c) || c === '.') {
      let n = c
      i++
      while (i < s.length && (isD(s[i]) || s[i] === '.')) {
        n += s[i]
        i++
      }
      tk.push({ t: 'num', v: parseFloat(n) })
      continue
    }
    if (c === 'π') {
      tk.push({ t: 'num', v: Math.PI })
      i++
      continue
    }
    if (c === 'e') {
      tk.push({ t: 'num', v: Math.E })
      i++
      continue
    }
    if (/[a-z]/i.test(c)) {
      let nm = c
      i++
      while (i < s.length && /[a-z]/i.test(s[i])) {
        nm += s[i]
        i++
      }
      tk.push({ t: 'func', v: nm })
      continue
    }
    if (c === '√') {
      tk.push({ t: 'func', v: 'sqrt' })
      i++
      continue
    }
    if ('+−×÷^'.includes(c)) {
      const p = tk[tk.length - 1]
      if (c === '−' && (!p || p.t === 'op' || p.t === 'neg' || (p.t === 'paren' && p.v === '('))) {
        tk.push({ t: 'neg' })
      } else tk.push({ t: 'op', v: c })
      i++
      continue
    }
    if (c === '(') {
      tk.push({ t: 'paren', v: '(' })
      i++
      continue
    }
    if (c === ')') {
      tk.push({ t: 'paren', v: ')' })
      i++
      continue
    }
    if (c === '!') {
      tk.push({ t: 'post', v: '!' })
      i++
      continue
    }
    if (c === '²') {
      tk.push({ t: 'post', v: '²' })
      i++
      continue
    }
    if (c === '%') {
      tk.push({ t: 'post', v: '%' })
      i++
      continue
    }
    i++
  }
  return tk
}

export function toRPN(tk) {
  const out = []
  const ops = []
  const peek = () => ops[ops.length - 1]
  for (const t2 of tk) {
    if (t2.t === 'num') out.push(t2)
    else if (t2.t === 'func') ops.push(t2)
    else if (t2.t === 'post') out.push(t2)
    else if (t2.t === 'neg') {
      while (ops.length) {
        const tp = peek()
        if (tp.t === 'op' && PREC[tp.v] > NEG_PREC) out.push(ops.pop())
        else break
      }
      ops.push(t2)
    } else if (t2.t === 'op') {
      const p1 = PREC[t2.v]
      while (ops.length) {
        const tp = peek()
        if (tp.t === 'op') {
          const p2 = PREC[tp.v]
          if (p2 > p1 || (p2 === p1 && !RIGHT[t2.v])) out.push(ops.pop())
          else break
        } else if (tp.t === 'neg') {
          if (NEG_PREC > p1) out.push(ops.pop())
          else break
        } else break
      }
      ops.push(t2)
    } else if (t2.t === 'paren' && t2.v === '(') ops.push(t2)
    else if (t2.t === 'paren' && t2.v === ')') {
      while (ops.length && !(peek().t === 'paren' && peek().v === '(')) out.push(ops.pop())
      if (ops.length) ops.pop()
      if (ops.length && peek().t === 'func') out.push(ops.pop())
    }
  }
  while (ops.length) {
    const tp = ops.pop()
    if (tp.t === 'paren') continue
    out.push(tp)
  }
  return out
}

const toRad = (x, isDeg) => (isDeg ? (x * Math.PI) / 180 : x)
const fromRad = (x, isDeg) => (isDeg ? (x * 180) / Math.PI : x)

function factorial(n) {
  if (Math.abs(n - Math.round(n)) < 1e-9) n = Math.round(n)
  if (n < 0 || !Number.isInteger(n)) throw new Error('fact')
  if (n > 170) return Infinity
  let r = 1
  for (let k = 2; k <= n; k++) r *= k
  return r
}

function applyFunc(name, a, isDeg) {
  switch (name) {
    case 'sin':
      return Math.sin(toRad(a, isDeg))
    case 'cos':
      return Math.cos(toRad(a, isDeg))
    case 'tan':
      return Math.tan(toRad(a, isDeg))
    case 'asin':
      return fromRad(Math.asin(a), isDeg)
    case 'acos':
      return fromRad(Math.acos(a), isDeg)
    case 'atan':
      return fromRad(Math.atan(a), isDeg)
    case 'log':
      return Math.log10(a)
    case 'ln':
      return Math.log(a)
    case 'sqrt':
      return Math.sqrt(a)
    case 'abs':
      return Math.abs(a)
    default:
      throw new Error('fn')
  }
}
function applyPost(v, a) {
  if (v === '!') return factorial(a)
  if (v === '²') return a * a
  if (v === '%') return a / 100
  throw new Error('post')
}
function applyOp(v, a, b) {
  switch (v) {
    case '+':
      return a + b
    case '−':
      return a - b
    case '×':
      return a * b
    case '÷':
      return a / b
    case '^':
      return Math.pow(a, b)
  }
}

export function evalRPN(rpn, isDeg) {
  const st = []
  for (const t2 of rpn) {
    if (t2.t === 'num') st.push(t2.v)
    else if (t2.t === 'neg') st.push(-st.pop())
    else if (t2.t === 'post') st.push(applyPost(t2.v, st.pop()))
    else if (t2.t === 'func') st.push(applyFunc(t2.v, st.pop(), isDeg))
    else if (t2.t === 'op') {
      const b = st.pop()
      const a = st.pop()
      st.push(applyOp(t2.v, a, b))
    }
  }
  if (st.length !== 1) throw new Error('parse')
  const r = st[0]
  if (typeof r !== 'number' || Number.isNaN(r) || !isFinite(r)) throw new Error('range')
  return r
}

export function autoClose(s) {
  let open = 0
  for (const c of s) {
    if (c === '(') open++
    else if (c === ')') open--
  }
  let e = s
  while (/[+−×÷^]$/.test(e)) e = e.slice(0, -1)
  return e + ')'.repeat(Math.max(0, open))
}

export function compute(s, isDeg) {
  return evalRPN(toRPN(tokenize(autoClose(s))), isDeg)
}

export function fmt(n) {
  if (!isFinite(n) || Number.isNaN(n)) return 'Error'
  if (n === 0) return '0'
  const abs = Math.abs(n)
  let s
  if (abs >= 1e12 || abs < 1e-9) {
    s = n.toExponential(6)
    s = s.replace(/(\.\d*?)0+e/, '$1e').replace(/\.e/, 'e')
  } else {
    s = String(parseFloat(n.toPrecision(12)))
  }
  return s
}
