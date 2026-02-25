import React, { useState, useEffect, useMemo } from 'react';
import { computeTipMetrics, computeFunnelMetrics } from '../services/analyticsService.js';
import { formatStx, truncateAddress } from '../utils/helpers.js';

