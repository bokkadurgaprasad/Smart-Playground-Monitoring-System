from scipy.spatial import distance as dist
import numpy as np

class CentroidTracker:
    def __init__(self, max_disappeared=40):
        self.nextObjectID = 0
        self.objects = {} # objectID -> centroid
        self.disappeared = {} # objectID -> count
        self.max_disappeared = max_disappeared
        self.previous_centroids = {}
    
    def register(self, centroid):
        self. objects[self.nextObjectID] = centroid
        self.previous_centroids[self.nextObjectID] = centroid
        self.disappeared[self.nextObjectID] = 0
        self.nextObjectID += 1
    
    def deregister(self, objectID):
        del self.objects[objectID]
        del self.previous_centroids[objectID]
        del self.disappeared[objectID]
        
    def update(self, rects):
        if len(rects) == 0:
            for objectID in list(self.disappeared.keys()):
                self.disappeared[objectID] += 1
                if self.disappeared[objectID] > self.max_disappeared:
                    self.deregister(objectID)
            return self.objects
    
        input_centroids = np.zeros((len(rects), 2), dtype="int")
        
        for (i, (x, y, w, h)) in enumerate(rects):
            cx = int(x + w / 2)
            cy = int(y + h / 2)
            input_centroids[i] = (cx, cy)
        
        if len(self.objects) == 0:
            for i in range(len(input_centroids)):
                self.register(input_centroids[i])
        else:
            objectIDs = list(self.objects.keys())
            objectCentroids = list(self.objects.values())
            
            D = dist.cdist(np.array(objectCentroids), input_centroids)
            rows = D.min(axis=1).argsort()
            cols = D.argmin(axis=1)[rows]
            
            usedRows, usedCols = set(), set()
            
            for (row, col) in zip(rows, cols):
                if row in usedRows or col in usedCols:
                    continue
                objectID = objectIDs[row]
                self.objects[objectID] = input_centroids[col]
                self.disappeared[objectID] = 0
                self.previous_centroids[objectID] = objectCentroids[row]
                usedRows.add(row)
                usedCols.add(col)
                
            unusedRows = set(range(0, D.shape[0])).difference(usedRows)
            unusedCols = set(range(0, D.shape[1])).difference(usedCols)
            
            for row in unusedRows:
                objectID = objectIDs[row]
                self.disappeared[objectID] += 1
                if self.disappeared[objectID] > self.max_disappeared:
                    self. deregister(objectID)
            
            for col in unusedCols:
                self.register(input_centroids[col])
            
        return self.objects
            
                