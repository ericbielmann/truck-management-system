import { useState } from 'react';
import { PieChart, Pie, BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { BarChart2, PieChart as PieChartIcon } from 'lucide-react';

// Using our theme colors
const COLORS = ['#2563eb', '#16a34a', '#7c3aed', '#ea580c', '#64748b'];

const TripChart = ({ viajes }) => {
  const [chartType, setChartType] = useState('pie');

  // Process data for the charts
  const processData = () => {
    // Group viajes by fuel type and sum quantities
    const groupedData = viajes.reduce((acc, viaje) => {
      if (!acc[viaje.combustible]) {
        acc[viaje.combustible] = {
          name: viaje.combustible,
          value: 0,
          fill: COLORS[Object.keys(acc).length % COLORS.length] // Add fill color to data
        };
      }
      acc[viaje.combustible].value += viaje.cantidad_litros;
      return acc;
    }, {});

    return Object.values(groupedData);
  };

  const data = processData();

  // Format large numbers with thousands separator
  const formatNumber = (number) => {
    return new Intl.NumberFormat('es-AR').format(number);
  };

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-2 border border-gray-200 rounded shadow-sm">
          <p className="font-medium">{payload[0].name}</p>
          <p className="text-gray-600">{`${formatNumber(payload[0].value)}L`}</p>
        </div>
      );
    }
    return null;
  };

  // Custom legend that uses our color scheme
  const CustomLegend = ({ payload }) => {
    return (
      <ul className="flex flex-wrap justify-center gap-4 mt-2">
        {payload.map((entry, index) => (
          <li key={`legend-${index}`} className="flex items-center gap-2">
            <div
              className="w-3 h-3 rounded-sm"
              style={{ backgroundColor: entry.payload.fill }}
            />
            <span className="text-sm text-gray-600">{entry.value}</span>
          </li>
        ))}
      </ul>
    );
  };

  return (
    <div>
      {/* Chart Type Toggle */}
      <div className="flex justify-end mb-4 gap-2">
        <button
          onClick={() => setChartType('pie')}
          className={`p-2 rounded ${
            chartType === 'pie' ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'
          }`}
          title="Gráfico de Torta"
        >
          <PieChartIcon className="h-5 w-5" />
        </button>
        <button
          onClick={() => setChartType('bar')}
          className={`p-2 rounded ${
            chartType === 'bar' ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'
          }`}
          title="Gráfico de Barras"
        >
          <BarChart2 className="h-5 w-5" />
        </button>
      </div>

      {/* Chart Container */}
      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          {chartType === 'pie' ? (
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend content={<CustomLegend />} />
            </PieChart>
          ) : (
            <BarChart
              data={data}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" className="opacity-50" />
              <XAxis dataKey="name" />
              <YAxis tickFormatter={(value) => `${formatNumber(value)}L`} />
              <Tooltip content={<CustomTooltip />} />
              <Legend content={<CustomLegend />} />
              <Bar dataKey="value">
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          )}
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default TripChart;