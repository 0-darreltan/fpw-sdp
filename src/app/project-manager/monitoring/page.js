// app/project-manager/monitoring/page.js
'use client'
import { useState, useEffect, useMemo } from 'react';
import PMLayout from '../../../components/pm/PMLayout.jsx';

export default function PMMonitoring() {
  const [selectedProject, setSelectedProject] = useState('PRJ-001');
  const [realTimeData, setRealTimeData] = useState({});
  const [alerts, setAlerts] = useState([]);

  const projects = [
    { id: 'PRJ-001', name: 'Rumah Keluarga Budi' },
    { id: 'PRJ-002', name: 'Gedung Perkantoran CV. Maju' },
    { id: 'PRJ-003', name: 'Renovasi Toko Sejahtera' },
    { id: 'PRJ-004', name: 'Jembatan Kecil Mandonga' }
  ];

  const monitoringData = useMemo(() => ({
    'PRJ-001': {
      status: 'On Track',
      progress: 25,
      budget: {
        allocated: 750000000,
        spent: 187500000,
        remaining: 562500000,
        burnRate: 5200000 // per day
      },
      schedule: {
        startDate: '2024-01-15',
        endDate: '2024-09-01',
        currentPhase: 'Design & Planning',
        daysRemaining: 185
      },
      team: {
        totalMembers: 8,
        activeToday: 6,
        productivity: 87,
        hoursLogged: 64
      },
      quality: {
        score: 4.2,
        issues: 3,
        resolved: 15,
        pending: 2
      },
      risks: [
        { id: 1, type: 'Budget', level: 'Medium', description: 'Material cost increase risk' },
        { id: 2, type: 'Schedule', level: 'Low', description: 'Weather dependency for foundation' }
      ],
      metrics: {
        safety: { incidents: 0, daysWithoutIncident: 45, score: 98 },
        environment: { complianceScore: 92, violations: 0 },
        client: { satisfactionScore: 4.5, feedbackCount: 8 }
      }
    },
    'PRJ-002': {
      status: 'At Risk',
      progress: 60,
      budget: {
        allocated: 7500000000,
        spent: 4500000000,
        remaining: 3000000000,
        burnRate: 15000000
      },
      schedule: {
        startDate: '2023-10-01',
        endDate: '2024-12-01',
        currentPhase: 'Construction',
        daysRemaining: 125
      },
      team: {
        totalMembers: 15,
        activeToday: 14,
        productivity: 92,
        hoursLogged: 128
      },
      quality: {
        score: 4.7,
        issues: 1,
        resolved: 28,
        pending: 1
      },
      risks: [
        { id: 1, type: 'Schedule', level: 'High', description: 'Structural work delay' },
        { id: 2, type: 'Resource', level: 'Medium', description: 'Crane availability issue' }
      ],
      metrics: {
        safety: { incidents: 1, daysWithoutIncident: 12, score: 85 },
        environment: { complianceScore: 95, violations: 0 },
        client: { satisfactionScore: 4.2, feedbackCount: 12 }
      }
    }
  }), []);

  const currentData = useMemo(() => {
    return monitoringData[selectedProject] || {};
  }, [selectedProject, monitoringData]);

  // Simulate real-time updates
  useEffect(() => {
    const activeToday = currentData.team?.activeToday || 0;
    
    const interval = setInterval(() => {
      setRealTimeData(prev => ({
        ...prev,
        lastUpdate: new Date().toLocaleTimeString('id-ID'),
        activeWorkers: Math.floor(Math.random() * 3) + activeToday,
        currentActivity: getRandomActivity()
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, [selectedProject, currentData.team?.activeToday]);

  const getRandomActivity = () => {
    const activities = [
      'Concrete pouring in progress',
      'Quality inspection ongoing',
      'Material delivery received',
      'Equipment maintenance',
      'Team meeting in progress',
      'Safety briefing conducted'
    ];
    return activities[Math.floor(Math.random() * activities.length)];
  };

  // Generate alerts
  useEffect(() => {
    const newAlerts = [];
    
    if (currentData.budget?.burnRate * 30 > currentData.budget?.remaining) {
      newAlerts.push({
        id: 1,
        type: 'Budget',
        level: 'Critical',
        message: 'Budget burn rate exceeds remaining allocation',
        timestamp: new Date().toISOString()
      });
    }

    if (currentData.schedule?.daysRemaining < 60 && currentData.progress < 80) {
      newAlerts.push({
        id: 2,
        type: 'Schedule',
        level: 'Warning',
        message: 'Project progress may not meet deadline',
        timestamp: new Date().toISOString()
      });
    }

    if (currentData.quality?.issues > 5) {
      newAlerts.push({
        id: 3,
        type: 'Quality',
        level: 'Warning',
        message: 'High number of quality issues detected',
        timestamp: new Date().toISOString()
      });
    }

    setAlerts(newAlerts);
  }, [selectedProject, currentData]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'On Track':
        return 'bg-green-100 text-green-800';
      case 'At Risk':
        return 'bg-yellow-100 text-yellow-800';
      case 'Delayed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getRiskLevelColor = (level) => {
    switch (level) {
      case 'Critical':
        return 'bg-red-100 text-red-800';
      case 'High':
        return 'bg-orange-100 text-orange-800';
      case 'Medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'Low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getAlertLevelColor = (level) => {
    switch (level) {
      case 'Critical':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'Warning':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Info':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <PMLayout>
      <div className="p-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Monitoring Real-time</h1>
              <p className="mt-2 text-gray-600">Pantau progress proyek secara real-time</p>
            </div>
            <div className="flex gap-3">
              <select
                value={selectedProject}
                onChange={(e) => setSelectedProject(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {projects.map(project => (
                  <option key={project.id} value={project.id}>
                    {project.name}
                  </option>
                ))}
              </select>
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                Export Data
              </button>
            </div>
          </div>
        </div>

        {/* Real-time Status */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Status Real-time</h3>
            <div className="flex items-center text-sm text-gray-600">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
              Last update: {realTimeData.lastUpdate || 'Loading...'}
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{currentData.progress}%</div>
              <div className="text-sm text-gray-600">Overall Progress</div>
              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full mt-2 ${getStatusColor(currentData.status)}`}>
                {currentData.status}
              </span>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {realTimeData.activeWorkers || currentData.team?.activeToday || 0}
              </div>
              <div className="text-sm text-gray-600">Active Workers</div>
              <div className="text-xs text-gray-500 mt-1">of {currentData.team?.totalMembers || 0} total</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">{currentData.team?.productivity || 0}%</div>
              <div className="text-sm text-gray-600">Team Productivity</div>
              <div className="text-xs text-gray-500 mt-1">{currentData.team?.hoursLogged || 0} hours logged</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{currentData.quality?.score || 0}/5</div>
              <div className="text-sm text-gray-600">Quality Score</div>
              <div className="text-xs text-gray-500 mt-1">{currentData.quality?.pending || 0} issues pending</div>
            </div>
          </div>

          <div className="mt-4 p-3 bg-blue-50 rounded-lg">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-blue-500 rounded-full mr-2 animate-pulse"></div>
              <span className="text-sm font-medium text-blue-900">Current Activity:</span>
              <span className="text-sm text-blue-700 ml-2">
                {realTimeData.currentActivity || 'Loading current activity...'}
              </span>
            </div>
          </div>
        </div>

        {/* Alerts */}
        {alerts.length > 0 && (
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Active Alerts</h3>
            <div className="space-y-3">
              {alerts.map((alert) => (
                <div key={alert.id} className={`p-4 rounded-lg border ${getAlertLevelColor(alert.level)}`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 mr-3">
                        {alert.level === 'Critical' && (
                          <svg className="w-5 h-5 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                          </svg>
                        )}
                        {alert.level === 'Warning' && (
                          <svg className="w-5 h-5 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                          </svg>
                        )}
                      </div>
                      <div>
                        <div className="flex items-center">
                          <span className="font-medium">{alert.type} Alert</span>
                          <span className={`ml-2 inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getRiskLevelColor(alert.level)}`}>
                            {alert.level}
                          </span>
                        </div>
                        <p className="text-sm mt-1">{alert.message}</p>
                      </div>
                    </div>
                    <button className="text-gray-400 hover:text-gray-600">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Key Metrics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8 mb-8">
          {/* Budget Monitoring */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Budget Monitoring</h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-600">Budget Usage</span>
                  <span className="text-sm font-medium">
                    {Math.round((currentData.budget?.spent / currentData.budget?.allocated) * 100)}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div 
                    className="bg-blue-600 h-3 rounded-full"
                    style={{ width: `${(currentData.budget?.spent / currentData.budget?.allocated) * 100}%` }}
                  ></div>
                </div>
              </div>
              
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Allocated:</span>
                  <span className="font-medium">{formatCurrency(currentData.budget?.allocated || 0)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Spent:</span>
                  <span className="font-medium text-orange-600">{formatCurrency(currentData.budget?.spent || 0)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Remaining:</span>
                  <span className="font-medium text-green-600">{formatCurrency(currentData.budget?.remaining || 0)}</span>
                </div>
                <div className="flex justify-between pt-2 border-t">
                  <span>Daily Burn Rate:</span>
                  <span className="font-medium text-red-600">{formatCurrency(currentData.budget?.burnRate || 0)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Schedule Monitoring */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Schedule Monitoring</h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-600">Time Progress</span>
                  <span className="text-sm font-medium">
                    {currentData.schedule?.daysRemaining} days left
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div 
                    className="bg-green-600 h-3 rounded-full"
                    style={{ width: `${100 - (currentData.schedule?.daysRemaining / 250) * 100}%` }}
                  ></div>
                </div>
              </div>
              
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Start Date:</span>
                  <span className="font-medium">{currentData.schedule?.startDate}</span>
                </div>
                <div className="flex justify-between">
                  <span>End Date:</span>
                  <span className="font-medium">{currentData.schedule?.endDate}</span>
                </div>
                <div className="flex justify-between">
                  <span>Current Phase:</span>
                  <span className="font-medium text-blue-600">{currentData.schedule?.currentPhase}</span>
                </div>
                <div className="flex justify-between pt-2 border-t">
                  <span>Progress vs Time:</span>
                  <span className={`font-medium ${currentData.progress >= 50 ? 'text-green-600' : 'text-yellow-600'}`}>
                    {currentData.progress >= 50 ? 'On Track' : 'Monitor'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Quality & Safety */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quality & Safety</h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-600">Safety Score</span>
                  <span className="text-sm font-medium">{currentData.metrics?.safety?.score}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div 
                    className="bg-green-600 h-3 rounded-full"
                    style={{ width: `${currentData.metrics?.safety?.score}%` }}
                  ></div>
                </div>
              </div>
              
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Quality Score:</span>
                  <span className="font-medium">{currentData.quality?.score}/5.0</span>
                </div>
                <div className="flex justify-between">
                  <span>Safety Incidents:</span>
                  <span className="font-medium">{currentData.metrics?.safety?.incidents}</span>
                </div>
                <div className="flex justify-between">
                  <span>Days w/o Incident:</span>
                  <span className="font-medium text-green-600">{currentData.metrics?.safety?.daysWithoutIncident}</span>
                </div>
                <div className="flex justify-between">
                  <span>Quality Issues:</span>
                  <span className="font-medium">{currentData.quality?.issues} pending</span>
                </div>
                <div className="flex justify-between pt-2 border-t">
                  <span>Client Satisfaction:</span>
                  <span className="font-medium text-blue-600">{currentData.metrics?.client?.satisfactionScore}/5.0</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Risk Assessment */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Current Risks */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Risk Assessment</h3>
            <div className="space-y-3">
              {currentData.risks?.map((risk) => (
                <div key={risk.id} className="p-3 border border-gray-200 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-gray-900">{risk.type} Risk</span>
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getRiskLevelColor(risk.level)}`}>
                      {risk.level}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">{risk.description}</p>
                  <div className="mt-2 flex gap-2">
                    <button className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded hover:bg-blue-200">
                      View Details
                    </button>
                    <button className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded hover:bg-green-200">
                      Add Mitigation
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Performance Charts */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Trends</h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-600">Weekly Productivity</span>
                  <span className="text-sm font-medium">+5.2%</span>
                </div>
                <div className="h-20 bg-gray-100 rounded flex items-end justify-around p-2">
                  <div className="bg-blue-500 rounded-t" style={{height: '60%', width: '12%'}}></div>
                  <div className="bg-blue-500 rounded-t" style={{height: '75%', width: '12%'}}></div>
                  <div className="bg-blue-500 rounded-t" style={{height: '45%', width: '12%'}}></div>
                  <div className="bg-blue-500 rounded-t" style={{height: '80%', width: '12%'}}></div>
                  <div className="bg-blue-500 rounded-t" style={{height: '90%', width: '12%'}}></div>
                  <div className="bg-blue-500 rounded-t" style={{height: '85%', width: '12%'}}></div>
                  <div className="bg-blue-500 rounded-t" style={{height: '95%', width: '12%'}}></div>
                </div>
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>Week 1</span>
                  <span>Week 7</span>
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-600">Cost Performance</span>
                  <span className="text-sm font-medium text-green-600">Under Budget</span>
                </div>
                <div className="h-20 bg-gray-100 rounded flex items-end justify-around p-2">
                  <div className="bg-green-500 rounded-t" style={{height: '50%', width: '12%'}}></div>
                  <div className="bg-green-500 rounded-t" style={{height: '65%', width: '12%'}}></div>
                  <div className="bg-yellow-500 rounded-t" style={{height: '85%', width: '12%'}}></div>
                  <div className="bg-yellow-500 rounded-t" style={{height: '90%', width: '12%'}}></div>
                  <div className="bg-green-500 rounded-t" style={{height: '70%', width: '12%'}}></div>
                  <div className="bg-green-500 rounded-t" style={{height: '75%', width: '12%'}}></div>
                  <div className="bg-green-500 rounded-t" style={{height: '68%', width: '12%'}}></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PMLayout>
  );
}