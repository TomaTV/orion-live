import t, { useEffect as $, useRef as e, memo as r } from "react";
let Chart = r(() => {
  let t = e(null),
    r = e(null),
    o = e(0);
  return (
    $(() => {
      let $ = t.current;
      if (!$) return;
      let e = $.getContext("2d", { alpha: !1 }),
        i = !0,
        l = () => {
          let t = $.getBoundingClientRect();
          ($.width = t.width), ($.height = t.height), i || h(100);
        },
        h = () => {
          e.clearRect(0, 0, $.width, $.height);
          let t = e.createRadialGradient(
            $.width / 2,
            $.height / 2,
            0,
            $.width / 2,
            $.height / 2,
            $.width / 2
          );
          t.addColorStop(0, "rgba(255, 255, 255, 0.4)"),
            t.addColorStop(0.7, "rgba(255, 255, 255, 0.1)"),
            t.addColorStop(1, "rgba(255, 255, 255, 0)"),
            e.beginPath();
          for (let r = 0; r <= 15; r++) {
            let i = (r / 15) * $.width,
              l = (r / 15) * $.height;
            e.moveTo(i, 0),
              e.lineTo(i, $.height),
              e.moveTo(0, l),
              e.lineTo($.width, l);
          }
          (e.strokeStyle = t), (e.lineWidth = 1), e.stroke(), a(o.current), d();
        },
        a = (t) => {
          let r = [
              [0.001 * $.width, 0.75 * $.height],
              [0.15 * $.width, 0.6 * $.height],
              [0.3 * $.width, 0.65 * $.height],
              [0.4 * $.width, 0.45 * $.height],
              [0.5 * $.width, 0.5 * $.height],
              [0.6 * $.width, 0.35 * $.height],
              [0.7 * $.width, 0.4 * $.height],
              [0.8 * $.width, 0.25 * $.height],
              [0.9 * $.width, 0.3 * $.height],
              [$.width, 0.2 * $.height],
            ],
            o = r.length,
            i = [];
          for (let l = 0; l < o - 1; l++) {
            let h = r[l],
              a = r[l + 1];
            for (let d = 0; d <= 200; d++) {
              let g = d / 200;
              i.push([h[0] + (a[0] - h[0]) * g, h[1] + (a[1] - h[1]) * g]);
            }
          }
          let n = Math.floor((t / 100) * i.length);
          e.beginPath(), e.moveTo(i[0][0], i[0][1]);
          for (let _ = 1; _ < n; _++) e.lineTo(i[_][0], i[_][1]);
          let w = e.createLinearGradient(0, 0, $.width, 0);
          w.addColorStop(0, "rgba(92, 77, 255, 0.8)"),
            w.addColorStop(0.5, "rgba(92, 77, 255, 0.5)"),
            w.addColorStop(1, "rgba(0, 207, 255, 0.3)"),
            (e.strokeStyle = w),
            (e.lineWidth = 6),
            (e.lineCap = "round"),
            (e.lineJoin = "miter"),
            100 === t
              ? ((e.shadowColor = "rgba(92, 77, 255, 0.3)"),
                (e.shadowBlur = 10),
                e.stroke(),
                (e.shadowColor = "transparent"))
              : e.stroke();
        },
        d = () => {
          let t = 0.35 * $.height,
            r = e.createLinearGradient(0, 0, 0, t);
          r.addColorStop(0, "rgba(0, 0, 0, 1)"),
            r.addColorStop(0.4, "rgba(0, 0, 0, 0.8)"),
            r.addColorStop(0.7, "rgba(0, 0, 0, 0.4)"),
            r.addColorStop(1, "rgba(0, 0, 0, 0)"),
            (e.fillStyle = r),
            e.fillRect(0, 0, $.width, t);
          let o = 0.2 * $.width,
            i = e.createLinearGradient(0, 0, o, 0);
          i.addColorStop(0, "rgba(0, 0, 0, 1)"),
            i.addColorStop(0.4, "rgba(0, 0, 0, 0.8)"),
            i.addColorStop(0.7, "rgba(0, 0, 0, 0.4)"),
            i.addColorStop(1, "rgba(0, 0, 0, 0)"),
            (e.fillStyle = i),
            e.fillRect(0, 0, o, $.height);
          let l = e.createLinearGradient($.width - o, 0, $.width, 0);
          l.addColorStop(0, "rgba(0, 0, 0, 0)"),
            l.addColorStop(0.3, "rgba(0, 0, 0, 0.4)"),
            l.addColorStop(0.6, "rgba(0, 0, 0, 0.8)"),
            l.addColorStop(1, "rgba(0, 0, 0, 1)"),
            (e.fillStyle = l),
            e.fillRect($.width - o, 0, o, $.height);
        },
        g = () => {
          o.current < 100 && i
            ? ((o.current += 0.5), h(), (r.current = requestAnimationFrame(g)))
            : (i = !1);
        };
      l();
      let n;
      return (
        window.addEventListener("resize", () => {
          n && clearTimeout(n), (n = setTimeout(l, 150));
        }),
        g(),
        () => {
          (i = !1),
            window.removeEventListener("resize", l),
            r.current && cancelAnimationFrame(r.current),
            n && clearTimeout(n);
        }
      );
    }, []),
    (
      <canvas
        ref={t}
        className="absolute inset-0 w-full h-full"
        style={{ opacity: 0.6 }}
      />
    )
  );
});
Chart.displayName = "Chart";
export default Chart;
