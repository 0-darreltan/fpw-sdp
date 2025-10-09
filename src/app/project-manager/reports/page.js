// app/project-manager/reports/page.js
'use client'
import { useState } from 'react';
import PMLayout from '../../../components/pm/PMLayout.jsx';

export default function PMReports() {
  const [selectedReportType, setSelectedReportType] = useState('project-summary');
  const [selectedProject, setSelectedProject] = useState('all');
  const [dateRange, setDateRange] = useState('month');
  const [generatingReport, setGeneratingReport] = useState(false);

  const projects = [
    { id: 'all', name: 'All Projects' },
    { id: 'PRJ-001', name: 'Rumah Keluarga Budi' },
    { id: 'PRJ-002', name: 'Gedung Perkantoran CV. Maju' },
    { id: 'PRJ-003', name: 'Renovasi Toko Sejahtera' },
    { id: 'PRJ-004', name: 'Jembatan Kecil Mandonga' }
  ];

  const reportTypes = [
    { id: 'project-summary', name: 'Project Summary Report', description: 'Overall project status and progress' },
    { id: 'financial', name: 'Financial Report', description: 'Budget usage and cost analysis' },
    { id: 'timeline', name: 'Timeline Analysis', description: 'Schedule performance and milestones' },
    { id: 'team-performance', name: 'Team Performance', description: 'Resource utilization and productivity' },
    { id: 'quality-safety', name: 'Quality & Safety Report', description: 'Quality metrics and safety statistics' },
    { id: 'risk-assessment', name: 'Risk Assessment', description: 'Current risks and mitigation strategies' }
  ];

  const dateRanges = [
    { id: 'week', name: 'Last Week' },
    { id: 'month', name: 'Last Month' },
    { id: 'quarter', name: 'Last Quarter' },
    { id: 'year', name: 'Last Year' },
    { id: 'custom', name: 'Custom Range' }
  ];

  const generateReport = async () => {
    setGeneratingReport(true);
    // Simulate report generation
    await new Promise(resolve => setTimeout(resolve, 2000));
    setGeneratingReport(false);
    
    // In real app, this would download or display the report
    alert('Report generated successfully!');
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  // Sample report data
  const reportData = {
    projectSummary: {
      totalProjects: 8,
      activeProjects: 4,
      completedProjects: 3,
      delayedProjects: 1,
      totalBudget: 12500000000,
      spentBudget: 7500000000,
      averageProgress: 68,
      onTimeDelivery: 87
    },
    financial: {
      budgetUtilization: 60,
      costVariance: -5.2,
      earningsPerProject: 1562500000,
      profitMargin: 18.5,
      cashFlow: 2800000000
    },
    timeline: {
      schedulePerformance: 92,
      milestonesAchieved: 15,
      delayedMilestones: 2,
      criticalPathTasks: 8,
      averageTaskDuration: 12
    },
    teamPerformance: {
      totalTeamMembers: 45,
      activeMembers: 42,
      averageProductivity: 87,
      hoursLogged: 3600,
      utilizationRate: 85
    },
    qualitySafety: {
      qualityScore: 4.4,
      safetyIncidents: 2,
      daysWithoutIncident: 89,
      auditScore: 92,
      clientSatisfaction: 4.6
    }
  };

  const getReportContent = () => {
    switch (selectedReportType) {
      case 'project-summary':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-blue-50 rounded-lg p-6">
              <div className="text-2xl font-bold text-blue-600">{reportData.projectSummary.totalProjects}</div>
              <div className="text-sm text-gray-600">Total Projects</div>
            </div>
            <div className="bg-green-50 rounded-lg p-6">
              <div className="text-2xl font-bold text-green-600">{reportData.projectSummary.activeProjects}</div>
              <div className="text-sm text-gray-600">Active Projects</div>
            </div>
            <div className="bg-yellow-50 rounded-lg p-6">
              <div className="text-2xl font-bold text-yellow-600">{reportData.projectSummary.delayedProjects}</div>
              <div className="text-sm text-gray-600">Delayed Projects</div>
            </div>
            <div className="bg-purple-50 rounded-lg p-6">
              <div className="text-2xl font-bold text-purple-600">{reportData.projectSummary.averageProgress}%</div>
              <div className="text-sm text-gray-600">Average Progress</div>
            </div>
          </div>
        );
      
      case 'financial':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h4 className="font-semibold text-gray-900 mb-2">Budget Overview</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Total Budget:</span>
                    <span className="font-medium">{formatCurrency(reportData.projectSummary.totalBudget)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Spent:</span>
                    <span className="font-medium">{formatCurrency(reportData.projectSummary.spentBudget)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Utilization:</span>
                    <span className="font-medium">{reportData.financial.budgetUtilization}%</span>
                  </div>
                </div>
              </div>
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h4 className="font-semibold text-gray-900 mb-2">Cost Performance</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Cost Variance:</span>
                    <span className="font-medium text-green-600">{reportData.financial.costVariance}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Profit Margin:</span>
                    <span className="font-medium">{reportData.financial.profitMargin}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Cash Flow:</span>
                    <span className="font-medium">{formatCurrency(reportData.financial.cashFlow)}</span>
                  </div>
                </div>
              </div>
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h4 className="font-semibold text-gray-900 mb-2">Revenue Analysis</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Avg per Project:</span>
                    <span className="font-medium">{formatCurrency(reportData.financial.earningsPerProject)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Completed Revenue:</span>
                    <span className="font-medium">{formatCurrency(4687500000)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Projected Revenue:</span>
                    <span className="font-medium">{formatCurrency(8125000000)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'timeline':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-blue-50 rounded-lg p-6">
                <div className="text-2xl font-bold text-blue-600">{reportData.timeline.schedulePerformance}%</div>
                <div className="text-sm text-gray-600">Schedule Performance</div>
              </div>
              <div className="bg-green-50 rounded-lg p-6">
                <div className="text-2xl font-bold text-green-600">{reportData.timeline.milestonesAchieved}</div>
                <div className="text-sm text-gray-600">Milestones Achieved</div>
              </div>
              <div className="bg-red-50 rounded-lg p-6">
                <div className="text-2xl font-bold text-red-600">{reportData.timeline.delayedMilestones}</div>
                <div className="text-sm text-gray-600">Delayed Milestones</div>
              </div>
              <div className="bg-yellow-50 rounded-lg p-6">
                <div className="text-2xl font-bold text-yellow-600">{reportData.timeline.criticalPathTasks}</div>
                <div className="text-sm text-gray-600">Critical Path Tasks</div>
              </div>
            </div>
          </div>
        );

      case 'team-performance':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
              <div className="bg-blue-50 rounded-lg p-6">
                <div className="text-2xl font-bold text-blue-600">{reportData.teamPerformance.totalTeamMembers}</div>
                <div className="text-sm text-gray-600">Total Members</div>
              </div>
              <div className="bg-green-50 rounded-lg p-6">
                <div className="text-2xl font-bold text-green-600">{reportData.teamPerformance.activeMembers}</div>
                <div className="text-sm text-gray-600">Active Members</div>
              </div>
              <div className="bg-purple-50 rounded-lg p-6">
                <div className="text-2xl font-bold text-purple-600">{reportData.teamPerformance.averageProductivity}%</div>
                <div className="text-sm text-gray-600">Avg Productivity</div>
              </div>
              <div className="bg-yellow-50 rounded-lg p-6">
                <div className="text-2xl font-bold text-yellow-600">{reportData.teamPerformance.hoursLogged}</div>
                <div className="text-sm text-gray-600">Hours Logged</div>
              </div>
              <div className="bg-indigo-50 rounded-lg p-6">
                <div className="text-2xl font-bold text-indigo-600">{reportData.teamPerformance.utilizationRate}%</div>
                <div className="text-sm text-gray-600">Utilization Rate</div>
              </div>
            </div>
          </div>
        );

      case 'quality-safety':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
              <div className="bg-blue-50 rounded-lg p-6">
                <div className="text-2xl font-bold text-blue-600">{reportData.qualitySafety.qualityScore}/5</div>
                <div className="text-sm text-gray-600">Quality Score</div>
              </div>
              <div className="bg-red-50 rounded-lg p-6">
                <div className="text-2xl font-bold text-red-600">{reportData.qualitySafety.safetyIncidents}</div>
                <div className="text-sm text-gray-600">Safety Incidents</div>
              </div>
              <div className="bg-green-50 rounded-lg p-6">
                <div className="text-2xl font-bold text-green-600">{reportData.qualitySafety.daysWithoutIncident}</div>
                <div className="text-sm text-gray-600">Days w/o Incident</div>
              </div>
              <div className="bg-yellow-50 rounded-lg p-6">
                <div className="text-2xl font-bold text-yellow-600">{reportData.qualitySafety.auditScore}%</div>
                <div className="text-sm text-gray-600">Audit Score</div>
              </div>
              <div className="bg-purple-50 rounded-lg p-6">
                <div className="text-2xl font-bold text-purple-600">{reportData.qualitySafety.clientSatisfaction}/5</div>
                <div className="text-sm text-gray-600">Client Satisfaction</div>
              </div>
            </div>
          </div>
        );

      case 'risk-assessment':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h4 className="font-semibold text-gray-900 mb-4">Risk Distribution</h4>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Critical Risks</span>
                    <div className="flex items-center">
                      <div className="w-20 bg-gray-200 rounded-full h-2 mr-2">
                        <div className="bg-red-500 h-2 rounded-full" style={{width: '25%'}}></div>
                      </div>
                      <span className="text-sm font-medium">2</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">High Risks</span>
                    <div className="flex items-center">
                      <div className="w-20 bg-gray-200 rounded-full h-2 mr-2">
                        <div className="bg-orange-500 h-2 rounded-full" style={{width: '37.5%'}}></div>
                      </div>
                      <span className="text-sm font-medium">3</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Medium Risks</span>
                    <div className="flex items-center">
                      <div className="w-20 bg-gray-200 rounded-full h-2 mr-2">
                        <div className="bg-yellow-500 h-2 rounded-full" style={{width: '62.5%'}}></div>
                      </div>
                      <span className="text-sm font-medium">5</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Low Risks</span>
                    <div className="flex items-center">
                      <div className="w-20 bg-gray-200 rounded-full h-2 mr-2">
                        <div className="bg-green-500 h-2 rounded-full" style={{width: '50%'}}></div>
                      </div>
                      <span className="text-sm font-medium">4</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h4 className="font-semibold text-gray-900 mb-4">Risk Categories</h4>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Budget Risks:</span>
                    <span className="text-sm font-medium">4</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Schedule Risks:</span>
                    <span className="text-sm font-medium">3</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Technical Risks:</span>
                    <span className="text-sm font-medium">2</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Resource Risks:</span>
                    <span className="text-sm font-medium">3</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">External Risks:</span>
                    <span className="text-sm font-medium">2</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return <div>Select a report type to view data</div>;
    }
  };

  return (
    <PMLayout>
      <div className="p-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Laporan & Analisis</h1>
              <p className="mt-2 text-gray-600">Generate dan analisis laporan proyek</p>
            </div>
            <button
              onClick={generateReport}
              disabled={generatingReport}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {generatingReport ? 'Generating...' : 'Generate Report'}
            </button>
          </div>
        </div>

        {/* Report Configuration */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Report Configuration</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Report Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Report Type</label>
              <select
                value={selectedReportType}
                onChange={(e) => setSelectedReportType(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {reportTypes.map(type => (
                  <option key={type.id} value={type.id}>{type.name}</option>
                ))}
              </select>
              <p className="text-xs text-gray-500 mt-1">
                {reportTypes.find(t => t.id === selectedReportType)?.description}
              </p>
            </div>

            {/* Project Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Project</label>
              <select
                value={selectedProject}
                onChange={(e) => setSelectedProject(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {projects.map(project => (
                  <option key={project.id} value={project.id}>{project.name}</option>
                ))}
              </select>
            </div>

            {/* Date Range */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Date Range</label>
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {dateRanges.map(range => (
                  <option key={range.id} value={range.id}>{range.name}</option>
                ))}
              </select>
            </div>
          </div>

          {dateRange === 'custom' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                <input
                  type="date"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                <input
                  type="date"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          )}
        </div>

        {/* Report Content */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold text-gray-900">
              {reportTypes.find(t => t.id === selectedReportType)?.name}
            </h3>
            <div className="flex gap-2">
              <button className="text-gray-600 hover:text-gray-800 p-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
              </button>
              <button className="text-gray-600 hover:text-gray-800 p-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                </svg>
              </button>
              <button className="text-gray-600 hover:text-gray-800 p-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                </svg>
              </button>
            </div>
          </div>
          
          {getReportContent()}
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <div className="text-center">
                <svg className="w-8 h-8 text-blue-600 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                <div className="text-sm font-medium">Monthly Dashboard</div>
              </div>
            </button>
            
            <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <div className="text-center">
                <svg className="w-8 h-8 text-green-600 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div className="text-sm font-medium">Financial Summary</div>
              </div>
            </button>
            
            <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <div className="text-center">
                <svg className="w-8 h-8 text-yellow-600 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div className="text-sm font-medium">Time Tracking</div>
              </div>
            </button>
            
            <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <div className="text-center">
                <svg className="w-8 h-8 text-purple-600 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <div className="text-sm font-medium">Team Report</div>
              </div>
            </button>
          </div>
        </div>
      </div>
    </PMLayout>
  );
}