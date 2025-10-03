import type React from "react"
import { ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, ReferenceLine, Area, Tooltip, Cell } from "recharts"
import styles from "./NPVChart.module.css"
import { useRef, useState } from "react"
import { TooltipIndex } from "recharts/types/state/tooltipSlice"
import { getYAxisTicksAndDomain } from "../NPVHelper"

interface NPVChartProps {
  data: Array<{
    monthStart: string
    monthEnd: string
    revenue: number
    miningCost: number
    processingCost: number
    cumulativeNetCash: number
  }>
  hoveredIndex: number | null
  setHoveredIndex: (index: number | null) => void
}

const NPVChart: React.FC<NPVChartProps> = ({ data, hoveredIndex, setHoveredIndex }) => {
  const activeDotRef = useRef<{ x: number, y: number } | null>(null);
  const { ticks, domain } = getYAxisTicksAndDomain(data)

  const handleMouseEnter = (_: any, index: number | TooltipIndex | undefined) => {
    if (typeof index === "number") {
      setHoveredIndex(index)
    } else if (typeof index === "string") {
      setHoveredIndex(parseInt(index))
    }
  }

  const handleMouseLeave = () => {
    setHoveredIndex(null)
    activeDotRef.current = null;
  }

  const transformedData = data.map((item) => ({
    ...item,
    miningCost: -Math.abs(item.miningCost), // Ensure mining cost is negative
    processingCost: -Math.abs(item.processingCost), // Ensure processing cost is negative
  }))

  const CustomXAxisTick = ({ x, y, payload, index }: {
    x: number, y: number, payload: any, index: number,
    isHovered: boolean
  }) => {
    const isHovered = hoveredIndex === index;

    // Skip every second label
    const showLabel = index % 2 === 0 || isHovered;
    if (!showLabel) return null;

    return (
      <g key={"x-axis-" + index} transform={`translate(${x},${y})`}>
        <rect
          x={-24}
          y={0}
          width={48}
          height={20}
          fill={isHovered ? 'var(--default-text)' : 'transparent'}
          rx={4}
        />
        <text
          x={0}
          y={15}
          textAnchor="middle"
          fill={isHovered ? 'var(--textSecondary)' : 'var(--default-text)'}
          fontSize={12}
          fontWeight="500"
        >
          {payload.value}
        </text>
      </g>
    );
  };

  const CustomTooltip = ({ active, payload, coordinate }: any) => {
    if (active && payload && payload.length && activeDotRef.current) {
      const data = payload[0].payload
      const revenue = data.revenue
      const miningCost = Math.abs(data.miningCost)
      const processingCost = Math.abs(data.processingCost)
      const periodNetCash = revenue - miningCost - processingCost
      const cumulativeNetCash = data.cumulativeNetCash

      const formatValue = (value: number) => {
        const millions = value / 1000000
        return `$${millions.toFixed(1)}M`
      }

      return (
        <div className={styles.tooltip}
          style={{
            position: 'absolute',
            left: activeDotRef.current.x,
            top: activeDotRef.current.y,
            transform: 'translateX(-50%) translateY(-130%)',
          }}
        >
          <div className={styles.tooltipItem}>
            <span className={styles.dateTooltip}>{data.monthStart}
              {data.monthStart === data.monthEnd ? "" : ` - ${data.monthEnd}`}</span>
          </div>
          <div className={styles.tooltipItem}>
            <div className={styles.indicator} style={{ backgroundColor: "var(--revenue)" }}></div>
            <span className={styles.label}>Revenue</span>
            <span className={styles.value}>{formatValue(revenue)}</span>
          </div>
          <div className={styles.tooltipItem}>
            <div className={styles.indicator} style={{ backgroundColor: "var(--mining-cost)" }}></div>
            <span className={styles.label}>Mining Cost</span>
            <span className={styles.value}>{formatValue(miningCost)}</span>
          </div>
          <div className={styles.tooltipItem}>
            <div className={styles.indicator} style={{ backgroundColor: "var(--processing-cost)" }}></div>
            <span className={styles.label}>Processing Cost</span>
            <span className={styles.value}>{formatValue(processingCost)}</span>
          </div>
          <div className={styles.tooltipSection}>
            <div className={styles.indicatorLong} style={{ backgroundColor: "var(--accent)" }}></div>
            <div className={styles.tooltipColumn}>
              <div className={styles.sectionTitle}>NET CASH FLOW</div>
              <div className={styles.tooltipItem}>
                <span className={styles.label}>Period</span>
                <span className={styles.value}>{formatValue(periodNetCash)}</span>
              </div>
              <div className={styles.tooltipItem}>
                <span className={styles.label}>Cumulative</span>
                <span className={styles.value}>{formatValue(cumulativeNetCash)}</span>
              </div>
            </div>
          </div>
        </div>
      )
    }
    return null
  }
  return (
    <div className={styles.chartContainer}>
      <ResponsiveContainer
        width="100%" height={400}>
        <ComposedChart
          stackOffset="sign"
          data={transformedData}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          onMouseMove={(state) => {
            if (state.isTooltipActive) {
              handleMouseEnter(state.activeDataKey, state.activeIndex)
            } else {
              handleMouseLeave()
            }
          }}
          onMouseLeave={handleMouseLeave}
        >
          <CartesianGrid horizontal={true} vertical={false} stroke="var(--chart-grid)" />

          <XAxis dataKey="monthStart" interval={0} axisLine={false} tickLine={false}
            tick={(props) => <CustomXAxisTick {...props} />}
          />

          <YAxis
            tick={{ fill: "var(--darker-text)", fontSize: 12 }}
            tickLine={false}
            domain={domain}
            ticks={ticks}
            tickFormatter={(value) => `$${value / 1_000_000}M`}
            interval={0}
            axisLine={false}
          />

          <ReferenceLine y={0} stroke="var(--tab-active)" strokeWidth={1} />

          {/* Define the gradient */}
          <defs>
            <linearGradient id="colorNetCash" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#6F714A" stopOpacity={0.24} />
              <stop offset="100%" stopColor="#6F714A" stopOpacity={0.02} />
            </linearGradient>
          </defs>

          {/* Fill under the line with gradient */}
          <Area
            type="linear"
            dataKey="cumulativeNetCash"
            stroke="none"
            fill="url(#colorNetCash)"
            activeDot={false}
          />

          <Bar dataKey="revenue" stackId="stack" name="Revenue" barSize={20} >
            {data.map((entry, index) => (
              <Cell
                key={`cell-revenue-${index}`}
                fill="var(--revenue)"
                fillOpacity={hoveredIndex == null || index === hoveredIndex ? 1 : 0.5}
              />
            ))}

          </Bar>

          <Bar dataKey="miningCost" stackId="stack"
            fill="var(--mining-cost)" name="Mining Cost" barSize={20}
          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-mining-cost-${index}`}
                fill="var(--mining-cost)"
                fillOpacity={hoveredIndex == null || index === hoveredIndex ? 1 : 0.5}
              />
            ))}
          </Bar>

          <Bar dataKey="processingCost" stackId="stack"
            fill="var(--processing-cost)" name="Processing Cost" barSize={20}
          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-processing-cost-${index}`}
                fill="var(--processing-cost)"
                fillOpacity={hoveredIndex == null || index === hoveredIndex ? 1 : 0.5}
              />
            ))}
          </Bar>
          {/* Cumulative net cash flow line */}
          <Line
            animateNewValues={true}
            isAnimationActive={false}
            type="linear"
            dataKey="cumulativeNetCash"
            fill="var(--accent)"
            stroke="var(--accent)"
            name="Cumulative Net Cash"
            dot={{ fill: "var(--accent)", r: 2, }}
            activeDot={(props) => {
              const { cx, cy } = props;
              activeDotRef.current = { x: cx, y: cy };
              return (
                <circle
                  cx={cx}
                  cy={cy}
                  r={3}
                  fill="var(--accent)"
                  stroke="#E5F3Eb"
                  strokeWidth={12}
                  strokeOpacity={0.38}
                />
              );
            }}
            opacity={hoveredIndex === null ? 1 : 0.5}
          />
          <Tooltip content={<CustomTooltip />}
            cursor={{ strokeDasharray: "4 4", stroke: "var(--tab-active)" }} />

        </ComposedChart>
      </ResponsiveContainer>
    </div>
  )
}

export default NPVChart
