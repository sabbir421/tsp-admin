import React, { useState, useMemo } from 'react';
import {
  BarChart3,
  TrendingUp,
  MapPin,
  Building2,
  Calendar,
  Layers,
  Sparkles,
  ArrowUpDown,
  Filter,
  Info,
} from 'lucide-react';
import {
  DHAKA_ZONES,
  PROPS,
  SAMPLE_REQ,
  comma,
  money,
  locTxt,
  locInfo,
} from '../utils/prototypeData';

// Prototype sample requirements
const DEMAND_REQS = [];

export default function ResearchPage() {
  const [selectedLoc, setSelectedLoc] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedTx, setSelectedTx] = useState('all');
  const [selectedBeds, setSelectedBeds] = useState('all');
  const [compareLevel, setCompareLevel] = useState('area'); // 'area' or 'district'
  const [sortCol, setSortCol] = useState('supply');
  const [sortAsc, setSortAsc] = useState(false);

  // Grouped location options
  const allLocations = useMemo(() => {
    const list = [];
    Object.entries(DHAKA_ZONES).forEach(([zone, areas]) => {
      areas.forEach((a) => {
        list.push({ area: `${a}, Dhaka`, name: a, zone });
      });
    });
    return list;
  }, []);

  // Filter listings & requirements based on selected criteria
  const { filteredSupply, filteredDemand } = useMemo(() => {
    const fSupply = PROPS.filter((p) => {
      if (selectedLoc !== 'all') {
        if (!p.area || !p.area.toLowerCase().includes(selectedLoc.toLowerCase())) return false;
      }
      if (selectedType !== 'all' && p.type !== selectedType) return false;
      if (selectedTx !== 'all' && p.purpose !== selectedTx) return false;
      if (selectedBeds !== 'all') {
        const b = Number(selectedBeds);
        if (b === 6 ? p.beds < 6 : p.beds !== b) return false;
      }
      return true;
    });

    const fDemand = DEMAND_REQS.filter((r) => {
      if (selectedLoc !== 'all') {
        if (!r.area || !r.area.toLowerCase().includes(selectedLoc.toLowerCase())) return false;
      }
      if (selectedType !== 'all' && r.type !== selectedType) return false;
      if (selectedTx !== 'all' && r.purpose !== selectedTx) return false;
      if (selectedBeds !== 'all') {
        const b = Number(selectedBeds);
        if (b === 6 ? r.beds < 6 : r.beds !== b) return false;
      }
      return true;
    });

    return { filteredSupply: fSupply, filteredDemand: fDemand };
  }, [selectedLoc, selectedType, selectedTx, selectedBeds]);

  // Aggregate KPIs
  const kpis = useMemo(() => {
    const supCount = filteredSupply.length;
    const demCount = filteredDemand.length;
    const ratio = supCount > 0 ? (demCount / supCount).toFixed(2) : demCount > 0 ? 'No supply' : '0.00';

    const salePrices = filteredSupply.filter((p) => p.purpose === 'Sale').map((p) => p.price);
    const rentPrices = filteredSupply.filter((p) => p.purpose === 'Rent').map((p) => p.price);

    const median = (arr) => {
      if (!arr.length) return 0;
      const sorted = [...arr].sort((a, b) => a - b);
      const mid = Math.floor(sorted.length / 2);
      return sorted.length % 2 !== 0 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
    };

    const avg = (arr) => (arr.length ? arr.reduce((a, b) => a + b, 0) / arr.length : 0);

    const medSale = median(salePrices);
    const medRent = median(rentPrices);

    // Price per sqft
    const salePsf = filteredSupply
      .filter((p) => p.purpose === 'Sale' && p.size > 0)
      .map((p) => p.price / p.size);
    const rentPsf = filteredSupply
      .filter((p) => p.purpose === 'Rent' && p.size > 0)
      .map((p) => p.price / p.size);

    const medSalePsf = median(salePsf);
    const medRentPsf = median(rentPsf);

    // Gross rental yield = (median rent psf * 12) / median sale psf * 100
    const grossYield = medSalePsf > 0 && medRentPsf > 0 ? ((medRentPsf * 12) / medSalePsf) * 100 : null;

    const daysOnMarket = filteredSupply.map((p) => p.days || 10);
    const medDom = median(daysOnMarket);

    const verifiedCount = filteredSupply.filter((p) => p.verified).length;
    const verifRate = supCount > 0 ? Math.round((verifiedCount / supCount) * 100) : 0;

    return {
      supCount,
      demCount,
      ratio,
      medSale,
      medRent,
      medSalePsf,
      medRentPsf,
      grossYield,
      medDom,
      verifRate,
    };
  }, [filteredSupply, filteredDemand]);

  // Aggregate by Area / Zone for comparison table & charts
  const comparisonData = useMemo(() => {
    const groups = {};

    const getKey = (areaStr) => {
      const info = locInfo(areaStr);
      if (!info) return 'Dhaka General';
      return compareLevel === 'district' ? info.dist : info.n;
    };

    // Populate supply
    filteredSupply.forEach((p) => {
      const k = getKey(p.area);
      if (!groups[k]) {
        groups[k] = { name: k, supply: 0, demand: 0, salePrices: [], rentPrices: [], psfList: [] };
      }
      groups[k].supply += 1;
      if (p.purpose === 'Sale') {
        groups[k].salePrices.push(p.price);
        if (p.size) groups[k].psfList.push(p.price / p.size);
      } else {
        groups[k].rentPrices.push(p.price);
      }
    });

    // Populate demand
    filteredDemand.forEach((r) => {
      const k = getKey(r.area);
      if (!groups[k]) {
        groups[k] = { name: k, supply: 0, demand: 0, salePrices: [], rentPrices: [], psfList: [] };
      }
      groups[k].demand += 1;
    });

    const median = (arr) => {
      if (!arr.length) return 0;
      const sorted = [...arr].sort((a, b) => a - b);
      const mid = Math.floor(sorted.length / 2);
      return sorted.length % 2 !== 0 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
    };

    return Object.values(groups).map((g) => {
      const medSale = median(g.salePrices);
      const medRent = median(g.rentPrices);
      const medPsf = median(g.psfList);
      const ratio = g.supply > 0 ? (g.demand / g.supply).toFixed(2) : g.demand > 0 ? 'No supply' : '0.00';
      return {
        ...g,
        medSale,
        medRent,
        medPsf,
        ratio,
      };
    });
  }, [filteredSupply, filteredDemand, compareLevel]);

  // Sorted list for table
  const sortedComparison = useMemo(() => {
    return [...comparisonData].sort((a, b) => {
      let va = a[sortCol];
      let vb = b[sortCol];
      if (sortCol === 'ratio') {
        va = parseFloat(a.ratio) || 0;
        vb = parseFloat(b.ratio) || 0;
      }
      if (typeof va === 'string') {
        return sortAsc ? va.localeCompare(vb) : vb.localeCompare(va);
      }
      return sortAsc ? va - vb : vb - va;
    });
  }, [comparisonData, sortCol, sortAsc]);

  const handleSort = (col) => {
    if (sortCol === col) setSortAsc(!sortAsc);
    else {
      setSortCol(col);
      setSortAsc(false);
    }
  };

  const maxDemand = Math.max(1, ...comparisonData.map((c) => c.demand));
  const maxSupply = Math.max(1, ...comparisonData.map((c) => c.supply));

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-[#1c2847] text-white rounded-2xl p-6 shadow-md border border-[#2a3a63]">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-[11px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-white/10 text-white tracking-wider">
            Platform Intelligence
          </span>
          <span className="text-[11px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-[#f2961d]/20 text-[#ffd39a] tracking-wider">
            Dhaka City Analytics
          </span>
        </div>
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight mb-2">
          Research &amp; Market Analysis (Decision Support)
        </h1>
        <p className="text-xs sm:text-sm text-[#c9d1e6] max-w-4xl leading-relaxed">
          Built strictly from TrueSpace Property&apos;s active records: buyer/tenant requirements, verified owner listings, site-visit requests, and transactions. Zero third-party conjecture or scraped estimates.
        </p>
        <div className="mt-4 pt-3 border-t border-white/10 flex flex-wrap items-center justify-between gap-3 text-xs text-[#a8b4d0]">
          <div>
            Sample in view: <b className="text-white">{filteredSupply.length}</b> listings ·{' '}
            <b className="text-white">{filteredDemand.length}</b> requirements across Dhaka City
          </div>
          <div>
            Computed live from local dataset · <span className="text-[#ffd39a]">Precision confidence active</span>
          </div>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-[#e3e7ef]">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-[#f2961d]" />
            <h2 className="text-xs font-bold uppercase tracking-wider text-[#1c2847]">
              Research Filter Controls
            </h2>
          </div>
          {(selectedLoc !== 'all' || selectedType !== 'all' || selectedTx !== 'all' || selectedBeds !== 'all') && (
            <button
              onClick={() => {
                setSelectedLoc('all');
                setSelectedType('all');
                setSelectedTx('all');
                setSelectedBeds('all');
              }}
              className="text-xs font-semibold text-[#f2961d] hover:underline"
            >
              Reset filters
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3.5 text-xs">
          {/* Location */}
          <div>
            <label className="block text-[11px] font-semibold text-[#667089] uppercase tracking-wider mb-1">
              Location
            </label>
            <select
              value={selectedLoc}
              onChange={(e) => setSelectedLoc(e.target.value)}
              className="w-full bg-[#f6f7fb] border border-[#e3e7ef] rounded-xl px-3 py-2 text-[#1c2847] font-medium focus:outline-none focus:border-[#f2961d]"
            >
              <option value="all">All Dhaka Locations</option>
              {Object.keys(DHAKA_ZONES).map((z) => (
                <optgroup key={z} label={z}>
                  {DHAKA_ZONES[z].map((a) => (
                    <option key={a} value={a}>
                      {a}
                    </option>
                  ))}
                </optgroup>
              ))}
            </select>
          </div>

          {/* Property Type */}
          <div>
            <label className="block text-[11px] font-semibold text-[#667089] uppercase tracking-wider mb-1">
              Property Type
            </label>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-full bg-[#f6f7fb] border border-[#e3e7ef] rounded-xl px-3 py-2 text-[#1c2847] font-medium focus:outline-none focus:border-[#f2961d]"
            >
              <option value="all">All Types</option>
              <option value="Apartment">Apartment</option>
              <option value="Duplex">Duplex</option>
              <option value="House">House</option>
              <option value="Plot">Plot / Land</option>
              <option value="Commercial Space">Commercial</option>
            </select>
          </div>

          {/* Transaction */}
          <div>
            <label className="block text-[11px] font-semibold text-[#667089] uppercase tracking-wider mb-1">
              Transaction
            </label>
            <select
              value={selectedTx}
              onChange={(e) => setSelectedTx(e.target.value)}
              className="w-full bg-[#f6f7fb] border border-[#e3e7ef] rounded-xl px-3 py-2 text-[#1c2847] font-medium focus:outline-none focus:border-[#f2961d]"
            >
              <option value="all">Sale &amp; Rent</option>
              <option value="Sale">Sale Only</option>
              <option value="Rent">Rent Only</option>
            </select>
          </div>

          {/* Bedrooms */}
          <div>
            <label className="block text-[11px] font-semibold text-[#667089] uppercase tracking-wider mb-1">
              Bedrooms
            </label>
            <select
              value={selectedBeds}
              onChange={(e) => setSelectedBeds(e.target.value)}
              className="w-full bg-[#f6f7fb] border border-[#e3e7ef] rounded-xl px-3 py-2 text-[#1c2847] font-medium focus:outline-none focus:border-[#f2961d]"
            >
              <option value="all">Any Bedrooms</option>
              <option value="1">1 Bed</option>
              <option value="2">2 Bed</option>
              <option value="3">3 Bed</option>
              <option value="4">4 Bed</option>
              <option value="5">5 Bed</option>
              <option value="6">6+ Bed</option>
            </select>
          </div>

          {/* Grouping Level */}
          <div>
            <label className="block text-[11px] font-semibold text-[#667089] uppercase tracking-wider mb-1">
              Compare By
            </label>
            <div className="flex bg-[#f6f7fb] border border-[#e3e7ef] rounded-xl p-1 gap-1">
              <button
                type="button"
                onClick={() => setCompareLevel('area')}
                className={`flex-1 py-1 rounded-lg text-center font-bold text-xs transition-all ${
                  compareLevel === 'area' ? 'bg-[#1c2847] text-white shadow-sm' : 'text-[#667089]'
                }`}
              >
                Neighbourhood
              </button>
              <button
                type="button"
                onClick={() => setCompareLevel('district')}
                className={`flex-1 py-1 rounded-lg text-center font-bold text-xs transition-all ${
                  compareLevel === 'district' ? 'bg-[#1c2847] text-white shadow-sm' : 'text-[#667089]'
                }`}
              >
                Zone
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-4 border border-[#e3e7ef] shadow-sm">
          <div className="text-[11px] font-semibold text-[#667089] uppercase tracking-wider">Active Supply</div>
          <div className="text-2xl font-extrabold text-[#1c2847] mt-1">{kpis.supCount}</div>
          <div className="text-[11px] text-[#667089] mt-0.5">Verified listings in view</div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-[#e3e7ef] shadow-sm">
          <div className="text-[11px] font-semibold text-[#667089] uppercase tracking-wider">Active Demand</div>
          <div className="text-2xl font-extrabold text-[#1c2847] mt-1">{kpis.demCount}</div>
          <div className="text-[11px] text-[#667089] mt-0.5">Approved requirements</div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-[#e3e7ef] shadow-sm">
          <div className="text-[11px] font-semibold text-[#667089] uppercase tracking-wider">Demand / Supply Ratio</div>
          <div className="text-2xl font-extrabold text-[#f2961d] mt-1">
            {kpis.ratio}
            {kpis.ratio !== 'No supply' ? '×' : ''}
          </div>
          <div className="text-[11px] text-[#667089] mt-0.5">Buyer requirements ÷ listings</div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-[#e3e7ef] shadow-sm">
          <div className="text-[11px] font-semibold text-[#667089] uppercase tracking-wider">Median Sale Price</div>
          <div className="text-2xl font-extrabold text-[#1c2847] mt-1">
            {kpis.medSale ? money(kpis.medSale, 'Sale') : '—'}
          </div>
          <div className="text-[11px] text-[#667089] mt-0.5">Across active sample</div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-[#e3e7ef] shadow-sm">
          <div className="text-[11px] font-semibold text-[#667089] uppercase tracking-wider">Median Monthly Rent</div>
          <div className="text-2xl font-extrabold text-[#1c2847] mt-1">
            {kpis.medRent ? money(kpis.medRent, 'Rent') : '—'}
          </div>
          <div className="text-[11px] text-[#667089] mt-0.5">Per calendar month</div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-[#e3e7ef] shadow-sm">
          <div className="text-[11px] font-semibold text-[#667089] uppercase tracking-wider">Avg Sale PSF</div>
          <div className="text-2xl font-extrabold text-[#1c2847] mt-1">
            {kpis.medSalePsf ? `৳${comma(Math.round(kpis.medSalePsf))}` : '—'}
          </div>
          <div className="text-[11px] text-[#667089] mt-0.5">Taka per square foot</div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-[#e3e7ef] shadow-sm">
          <div className="text-[11px] font-semibold text-[#667089] uppercase tracking-wider">Gross Rental Yield</div>
          <div className="text-2xl font-extrabold text-[#1f9d63] mt-1">
            {kpis.grossYield ? `${kpis.grossYield.toFixed(2)}%` : '—'}
          </div>
          <div className="text-[11px] text-[#667089] mt-0.5">Annualized rent ÷ property cost</div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-[#e3e7ef] shadow-sm">
          <div className="text-[11px] font-semibold text-[#667089] uppercase tracking-wider">Verification Rate</div>
          <div className="text-2xl font-extrabold text-[#1c2847] mt-1">{kpis.verifRate}%</div>
          <div className="text-[11px] text-[#667089] mt-0.5">Listings with verified papers</div>
        </div>
      </div>

      {/* Visual Analytics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Demand Pressure by Area */}
        <div className="bg-white rounded-2xl p-5 border border-[#e3e7ef] shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-extrabold text-[#1c2847] text-sm flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-[#f2961d]" />
              <span>Highest Demand Corridors (Requirements)</span>
            </h3>
            <span className="text-[11px] text-[#667089] font-medium">By active requirements</span>
          </div>
          <div className="space-y-3">
            {comparisonData
              .filter((c) => c.demand > 0)
              .sort((a, b) => b.demand - a.demand)
              .slice(0, 6)
              .map((item) => (
                <div key={item.name} className="space-y-1">
                  <div className="flex items-center justify-between text-xs font-semibold">
                    <span className="text-[#1c2847]">{item.name}</span>
                    <span className="text-[#f2961d]">{item.demand} buyers / tenants</span>
                  </div>
                  <div className="w-full bg-[#eef1f8] h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-[#f2961d] h-full rounded-full transition-all duration-500"
                      style={{ width: `${(item.demand / maxDemand) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
          </div>
        </div>

        {/* Supply Volume by Area */}
        <div className="bg-white rounded-2xl p-5 border border-[#e3e7ef] shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-extrabold text-[#1c2847] text-sm flex items-center gap-2">
              <Building2 className="w-4 h-4 text-[#1c2847]" />
              <span>Active Supply Volume</span>
            </h3>
            <span className="text-[11px] text-[#667089] font-medium">By verified listings</span>
          </div>
          <div className="space-y-3">
            {comparisonData
              .filter((c) => c.supply > 0)
              .sort((a, b) => b.supply - a.supply)
              .slice(0, 6)
              .map((item) => (
                <div key={item.name} className="space-y-1">
                  <div className="flex items-center justify-between text-xs font-semibold">
                    <span className="text-[#1c2847]">{item.name}</span>
                    <span className="text-[#1c2847]">{item.supply} listings</span>
                  </div>
                  <div className="w-full bg-[#eef1f8] h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-[#1c2847] h-full rounded-full transition-all duration-500"
                      style={{ width: `${(item.supply / maxSupply) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>

      {/* Comparison Data Table */}
      <div className="bg-white rounded-2xl border border-[#e3e7ef] shadow-sm overflow-hidden">
        <div className="p-4 border-b border-[#e3e7ef] flex items-center justify-between">
          <div>
            <h3 className="font-extrabold text-[#1c2847] text-sm">
              Comparative Location Analytics ({sortedComparison.length}{' '}
              {compareLevel === 'district' ? 'Zones' : 'Neighbourhoods'})
            </h3>
            <p className="text-xs text-[#667089] mt-0.5">
              Cross-comparing demand density against available supply and price index across Dhaka
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#f6f7fb] text-[#667089] uppercase tracking-wider text-[11px] font-bold border-b border-[#e3e7ef]">
              <tr>
                <th
                  onClick={() => handleSort('name')}
                  className="py-3 px-4 cursor-pointer hover:text-[#1c2847]"
                >
                  <div className="flex items-center gap-1">
                    <span>{compareLevel === 'district' ? 'Zone / Division' : 'Neighbourhood'}</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('supply')}
                  className="py-3 px-4 cursor-pointer hover:text-[#1c2847]"
                >
                  <div className="flex items-center gap-1">
                    <span>Active Supply</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('demand')}
                  className="py-3 px-4 cursor-pointer hover:text-[#1c2847]"
                >
                  <div className="flex items-center gap-1">
                    <span>Active Demand</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('ratio')}
                  className="py-3 px-4 cursor-pointer hover:text-[#1c2847]"
                >
                  <div className="flex items-center gap-1">
                    <span>Demand / Supply Ratio</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('medSale')}
                  className="py-3 px-4 cursor-pointer hover:text-[#1c2847]"
                >
                  <div className="flex items-center gap-1">
                    <span>Median Sale Price</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('medRent')}
                  className="py-3 px-4 cursor-pointer hover:text-[#1c2847]"
                >
                  <div className="flex items-center gap-1">
                    <span>Median Rent</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('medPsf')}
                  className="py-3 px-4 cursor-pointer hover:text-[#1c2847]"
                >
                  <div className="flex items-center gap-1">
                    <span>Avg PSF (Sale)</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e3e7ef]">
              {sortedComparison.map((row) => (
                <tr key={row.name} className="hover:bg-[#f6f7fb]/70 transition-colors">
                  <td className="py-3 px-4 font-bold text-[#1c2847]">{row.name}</td>
                  <td className="py-3 px-4 font-semibold text-[#1c2847]">
                    <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                      {row.supply} listings
                    </span>
                  </td>
                  <td className="py-3 px-4 font-semibold text-[#f2961d]">
                    <span className="px-2 py-0.5 rounded-full bg-orange-50 text-orange-700">
                      {row.demand} buyers
                    </span>
                  </td>
                  <td className="py-3 px-4 font-extrabold text-[#1c2847]">
                    {row.ratio !== 'No supply' ? `${row.ratio}×` : (
                      <span className="text-slate-400 font-normal">No supply</span>
                    )}
                  </td>
                  <td className="py-3 px-4 font-medium text-[#1c2847]">
                    {row.medSale ? money(row.medSale, 'Sale') : <span className="text-slate-400">—</span>}
                  </td>
                  <td className="py-3 px-4 font-medium text-[#1c2847]">
                    {row.medRent ? money(row.medRent, 'Rent') : <span className="text-slate-400">—</span>}
                  </td>
                  <td className="py-3 px-4 font-medium text-[#1c2847]">
                    {row.medPsf ? `৳${comma(Math.round(row.medPsf))}` : <span className="text-slate-400">—</span>}
                  </td>
                </tr>
              ))}
              {sortedComparison.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-[#667089]">
                    No properties or requirements match the current filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
