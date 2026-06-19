{!result && sentences[index] && (
  <>
    <PracticeCard sentence={sentences[index]} index={index} total={sentences.length} />
    <RecordButton recording={recording} loading={loading} onStart={start} onStop={handleStop} />
    {loading && (
      <div className="text-center space-y-2">
        <p className="text-gray-400 text-sm animate-pulse">
          Analyzing your pronunciation...
        </p>
        <p className="text-gray-600 text-xs">
          This may take up to 30 seconds on first use
        </p>
      </div>
    )}
  </>
)}