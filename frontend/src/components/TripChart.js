import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

const TripChart = ({ viajes }) => {
  // Process data for the chart
  const processData = () => {
    // Group viajes by date and sum fuel quantities
    const groupedData = viajes.reduce((acc, viaje) => {
      const date = format(new Date(viaje.fecha_salida), 'yyyy-MM-dd');
      if (!acc[date]) {
        acc[date] = {
          date,
          'Diésel': 0,
          'Nafta Super': 0,
          'Nafta Premium': 0,
          'GNC': 0,
          'GLP': 0,
        };
      }
      acc[date][viaje.combustible] += viaje.cantidad_litros;
      return acc;
    }, {});

    // Convert to array and sort by date
    return Object.values(groupedData).sort((a, b) => new Date(a.date) - new Date(b.date));
  };

  const data = processData();

  // Format large numbers with thousands separator
  const formatNumber = (number) => {
    return new Intl.NumberFormat('es-AR').format(number);
  };

  return (
    <div className="h-[400px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="date" 
            tickFormatter={(date) => format(new Date(date), 'dd/MM', { locale: es })}
          />
          <YAxis 
            tickFormatter={(value) => `${formatNumber(value)}L`}
          />
          <Tooltip 
            labelFormatter={(date) => format(new Date(date), 'dd/MM/yyyy', { locale: es })}
            formatter={(value, name) => [`${formatNumber(value)}L`, name]}
          />
          <Legend />
          <Area 
            type="monotone" 
            dataKey="Diésel" 
            stackId="1"
            stroke="#4b5563" 
            fill="#4b5563" 
            fillOpacity={0.6}
          />
          <Area 
            type="monotone" 
            dataKey="Nafta Super" 
            stackId="1"
            stroke="#2563eb" 
            fill="#2563eb"
            fillOpacity={0.6}
          />
          <Area 
            type="monotone" 
            dataKey="Nafta Premium" 
            stackId="1"
            stroke="#7c3aed" 
            fill="#7c3aed"
            fillOpacity={0.6}
          />
          <Area 
            type="monotone" 
            dataKey="GNC" 
            stackId="1"
            stroke="#16a34a" 
            fill="#16a34a"
            fillOpacity={0.6}
          />
          <Area 
            type="monotone" 
            dataKey="GLP" 
            stackId="1"
            stroke="#ea580c" 
            fill="#ea580c"
            fillOpacity={0.6}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TripChart;