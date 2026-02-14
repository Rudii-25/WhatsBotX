import { useState, useEffect } from 'react';

export interface GitHubStats {
  stars: number;
  issues: number;
  pullRequests: number;
  contributors: number;
  forks: number;
  linesOfCode: number;
  loading: boolean;
  error: string | null;
}

const useGitHubStats = () => {
  const [stats, setStats] = useState<GitHubStats>({
    stars: 5,
    issues: 0,
    pullRequests: 0,
    contributors: 1,
    forks: 3,
    linesOfCode: 15937,
    loading: true,
    error: null,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Fetch repository info
        const repoResponse = await fetch(
          'https://api.github.com/repos/Rudii-25/WhatsBotX',
          {
            headers: {
              'Accept': 'application/vnd.github.v3+json',
            },
          }
        );

        if (!repoResponse.ok) throw new Error('Failed to fetch repo');
        
        const repoData = await repoResponse.json();

        // Fetch issues with pagination link
        const issuesResponse = await fetch(
          'https://api.github.com/repos/Rudii-25/WhatsBotX/issues?state=open&per_page=1',
          {
            headers: {
              'Accept': 'application/vnd.github.v3+json',
            },
          }
        );

        // Fetch pull requests with pagination link
        const prsResponse = await fetch(
          'https://api.github.com/repos/Rudii-25/WhatsBotX/pulls?state=all&per_page=1',
          {
            headers: {
              'Accept': 'application/vnd.github.v3+json',
            },
          }
        );

        // Fetch contributors
        const contributorsResponse = await fetch(
          'https://api.github.com/repos/Rudii-25/WhatsBotX/contributors?per_page=100',
          {
            headers: {
              'Accept': 'application/vnd.github.v3+json',
            },
          }
        );

        const issuesData = await issuesResponse.json();
        const prsData = await prsResponse.json();
        const contributorsData = await contributorsResponse.json();

        // Parse pagination link headers
        const parsePageCount = (linkHeader: string | null): number => {
          if (!linkHeader) return 0;
          const lastLink = linkHeader.split(',').find(link => link.includes('rel="last"'));
          if (!lastLink) return 0;
          const match = lastLink.match(/page=(\d+)/);
          return match ? parseInt(match[1]) : 0;
        };

        const totalIssues = parsePageCount(issuesResponse.headers.get('link'));
        const totalPRs = parsePageCount(prsResponse.headers.get('link'));
        const totalContributors = Array.isArray(contributorsData) ? contributorsData.length : 0;

        // Estimate lines of code based on repository size in KB
        const estimatedLOC = Math.round((repoData.size || 1000) * 0.6);

        setStats({
          stars: repoData.stargazers_count || 0,
          issues: totalIssues,
          pullRequests: totalPRs,
          contributors: totalContributors,
          forks: repoData.forks_count || 0,
          linesOfCode: estimatedLOC,
          loading: false,
          error: null,
        });
      } catch (err) {
        console.error('Error fetching GitHub stats:', err);
        setStats(prev => ({
          ...prev,
          loading: false,
          error: 'Failed to fetch live stats',
        }));
      }
    };

    fetchStats();
    
    // Refresh stats every 5 minutes
    const interval = setInterval(fetchStats, 5 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, []);

  return stats;
};

export default useGitHubStats;
